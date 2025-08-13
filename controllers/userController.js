const UserModel = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const request = require('request');
require('dotenv').config();


//register
exports.userRegisterCtrl = async function (req, res) {

  UserModel.addRegisterFormInfo(req.body, function (err, results) {
    console.log("req body in addregister cntrl is...", req.body);
    const { name } = req.body;

    if (err) {
      console.log("Error inserting into user_registration....", err.message);
      return res.send({ status: 400, "error": err.message });;
    }

    if (!results || !results.insertId) {
      return res.send({ status: 500, error: "No insertId returned from registration insert" });
    }

    const registrationId = results.insertId;
    console.log("New Registration record is inserted with ID-", registrationId);

    //check if insert was successful and get the registration_id
    if (results && registrationId) {
      UserModel.addUser(registrationId, name, function (err, results) {
        if (err) {
          console.error("Error inserting into users table:", JSON.stringify(err));
          return res.send({ status: 500, error: "Failed to register user" });
        }
        res.send({ status: 200, msg: `User has been Registered successfully` });
      });
    } else {
      res.send({ status: 500, msg: `Failed to Register user in user_registration` });
    }

  });

}

//Login
exports.userLoginCtrl = function (req, res) {
  console.log("login req body is...", req.body);
  const { phonenumber } = req.body;
  console.log("destructure phonenumbr is..", phonenumber);


  UserModel.loginFormInfo(phonenumber, async function (err, results) {
    if (err) {
      return res.send({ status: 400, error: err.message || "Login failed" });
    }
    if (!results) {
      return res.send({ status: 400, error: "User not found" });
    }

    //user found in db
    if (results) {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const url = `https://sms.sunstechit.com/app/smsapi/index.php?key=${process.env.SMS_API_KEY}&campaign=0&routeid=13&type=text&contacts=${phonenumber}&senderid=GDWOTP&msg=Your OTP for verification is ${otp}. 
      Do not share this with anyone. - Godavari Wave Technologies&template_id=${process.env.SMS_TEMPLATE_ID}`;

      //store the Above generated otp 
      UserModel.storeOtp(phonenumber, otp, (err) => {
        if (err) {
          console.log("Error storing OTP:", err.message);
          return res.send({ status: 500, error: "Failed to store OTP" });
        }

        //Send OTP via SMS
        request(url, function (error, response, body) {    //request library (a popular Node.js HTTP client)
          if (error) {
            console.error("Error sending SMS:", error.message);
            return res.send({ status: 500, error: "Failed to store OTP" });
          }

          if (response.statusCode === 200) {
            console.log("SMS sent successfully:", body);
            return res.send({ status: 200, msg: "OTP sent successfully", data: results });
          } else {
            console.error('SMS API error:', body);
            return res.send({ status: 500, error: "Failed to send OTP" });
          }
        });

        //res.send({ status: 200, msg: "login successful" });
      });
    }

  });
}

//OTP verify
exports.verifyOtpCtrl = function (req, res) {
  const { Id, Name, Email, Phone, otp } = req.body;
  console.log(`In verify cntrl id:-${Id} name:-${Name} email:-${Email} phone:-${Phone} otp:-${otp}`);
  // console.log("phone in cntrl - ", Phone);
  // console.log("otp in cntrl - ", otp);


  if (!Phone || !otp) {
    return res.send({ status: 400, error: "Phone number an OTP are required" });
  }

  UserModel.verifyOtp(Phone, otp, (err, isValid, message) => {
    if (err) {
      console.error("Error verifying OTP:", err.message);
      return res.send({ status: 500, error: "Failed to verify OTP" });
    }

    if (!isValid) {
      return res.send({ status: 400, error: message });
      //so we dispaly this message in verification screen
    }

    //generate JWT token with user-specific payload
    const payload = {
      Id, Name, Email, Phone
    };
    console.log("payload obj is..", payload);

    const token = jwt.sign(payload, '1234567890');
    console.log("TOKEN", token);
    //const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ status: 200, msg: "OTP verified successfully", token: token, payload: payload });
  });
  /**
 *    const token = jwt.sign({ course: 'backend', iat: Math.floor(Date.now() / 1000) - 30 }, 'secret');
 * The JWT payload only includes { course: 'backend', iat: Math.floor(Date.now() / 1000) - 30 }, which is not very meaningful for authentication. 
 * The payload should include user-specific data (e.g., phone or a user ID) to identify the authenticated user.
 */
}


//resend OTP
exports.resendOtpCtrl = function (req, res) {
  const { Phone } = req.body;
  console.log("phone num in cntrl is..", Phone);
  if (!Phone) {
    return res.send({ status: 400, error: "Phone number is required" });
  }

  UserModel.loginFormInfo(Phone, async function (err, results) {
    if (err) {
      res.send({ status: 400, error: err.message || "Failed to process request" });
      return;
    }
    if (!results) {
      return res.send({ status: 400, error: "User not found" });
    }

    //user found in db
    if (results) {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const url = `https://sms.sunstechit.com/app/smsapi/index.php?key=${process.env.SMS_API_KEY}&campaign=0&routeid=13&type=text&contacts=${Phone}&senderid=GDWOTP&msg=Your OTP for verification is ${otp}. 
      Do not share this with anyone. - Godavari Wave Technologies&template_id=${process.env.SMS_TEMPLATE_ID}`;

      //store the Above newly generated otp in db
      UserModel.storeOtp(Phone, otp, (err) => {
        if (err) {
          console.log("Error storing OTP:", err.message);
          return res.send({ status: 500, error: "Failed to store OTP" });
        }

        //Send OTP via SMS
        request(url, function (error, response, body) {    //request library (a popular Node.js HTTP client)
          if (error) {
            console.error("Error sending SMS:", error.message);
            return res.send({ status: 500, error: "Failed to send OTP" });
          }

          if (response.statusCode === 200) {
            console.log("SMS sent successfully:", body);

            res.send({ status: 200, msg: "OTP sent successfully", data: results });
          } else {
            console.error('SMS API error:', body);
            res.send({ status: 500, error: "Failed to send OTP" });
          }
        });

        //res.send({ status: 200, msg: "login successful" });
      });
    }

  });


}

//get all categories
exports.getAllCtgrsCtrl = function (req, res) {
  UserModel.getAllCtgrs(function (err, results) {
    if (err) {
      console.error("Error fetching categories:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  });
};


//select category
exports.selectCtgryCtrl = function (req, res) {
  const { categoryId } = req.body;

  console.log("authorization req-user", req.user);
  const { Phone } = req.user; //from JWT token

  if (!categoryId) {
    return res.send({ status: 400, error: "Category ID is required" });
  }

  try {
    //find "registration_id" from user_registration table using authenticated user phonenumber "phone"
    UserModel.selectUserRegister({ Phone }, function (err, results) {
      if (err) {
        console.error("Error fetching user:", err.message);
        return res.send({ status: 500, msg: "Server Error" });
      }
      if (!results || results.length === 0) {
        return res.send({ status: 404, error: "User not found" });
      }

      const { id, name } = results[0];
      console.log(`captured registration id-${id} name-${name} categoryid-${categoryId}`);

      //update or insert "category_id" in users table
      UserModel.updateUserCategory(id, name, categoryId, function (err, results) {
        if (err) {
          console.error("Error updating category:", err.message);
          return res.send({ status: 500, error: "Failed to update category" });
        }
        res.send({ status: 200, msg: "Category updated successfully" });
      });

      // UserModel.addUserCategory(id, name, categoryId, function (err, results) {
      //   if (err) {
      //     console.error("Error inserting user category:", err.message);
      //     return res.send({ status: 500, error: "Failed to add category" });
      //   }
      //   res.send({ status: 200, msg: "Category added successfully" });
      // });

    });

  } catch (error) {
    console.error("Error in selectCategoryCtrl:", error.message);
    res.send({ status: 500, error: "Server Error" });
  }

}


//post category in sub-categories table
exports.postCtgryCtrl = function (req, res) {
  const { categoryId } = req.body;
  console.log(`captured categoryId-${categoryId} in postCtgryCtrl`);

  if (!categoryId) {
    return res.send({ status: 400, error: "Category ID is required" });
  }

  UserModel.postCtgry(req.body, function (err, results) {
    if (err) {
      console.error("Error fetching categories:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, "data": results });
  });
}

//get sub-categories
exports.getSubCtgrsCtrl = function (req, res) {
  console.log("Full req.query:", req.query);

  const { category_id } = req.query;
  console.log("captured category id for sub-category products is...", category_id);

  if (!category_id) {
    return res.send({ status: 400, error: "Category ID is required" });
  }


  UserModel.getSubCategories(category_id, function (err, results) {
    if (err) {
      console.error("Error fetching sub-categories:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  })


}

//get all products based on their sub-category
exports.getSubctrgyProductsInfoCtrl = function (req, res) {
  console.log("req query in sub-category products info is..", req.query);
  const { id } = req.query;

  console.log("sub-category products info cntrl ID :", id);

  UserModel.getSubctrgyProductsInfo(id, function (err, results) {
    if (err) {
      console.error("Error fetching sub-categories Info:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  })
}


//get product Details based on their "id"
exports.getProductDetailInfoCtrl = function (req, res) {
  console.log("req query in sub-category PRODUCT-DETAIL info is..", req.query);
  const { id } = req.query;

  console.log("sub-category PRODUCT-DETAIL info cntrl ID :", id);

  UserModel.getProductDetailInfo(id, function (err, results) {

    if (err) {
      console.error("Error fetching sub-categories productDetail Info:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  });
}


//check stocks availabilty(case: CheckCart)
exports.checkStockAvailbilityForCheckCartCtrl = function (req, res) {
  console.log("req body in stockavailability:", req.body);

  UserModel.checkStockAvailbility(req.body, function (err, results) {
    if (err) {
      console.error("Database error:", err);
      return res.status(400).send({ status: 400, error: err.message || "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).send({ status: 400, error: "No matching stock found" });
    }

    // If stock exists, get the stock ID
    const stockId = results[0].id;
    console.log("Found stock ID:", stockId);

    const userId = req.user?.Id; // user ID is available from auth middleware
    if (!userId) {
      return res.status(401).send({ status: 401, error: "User not authenticated" });
    }

    //Check if the stock_id already exists in the cart for this user
    UserModel.checkCartRecord(userId, stockId, function (err, results) {
      if (err) {
        console.error("Error Checking record in CART tbl:", err.message);
        return res.send({ status: 500, msg: "Server Error" });
      }

      if (results.length > 0) {
        res.send({ status: 200, message: "Selected product is already available in the cart", Data: { cartId: results[0].id, userID: userId } }); //{ cartId: cartCheckResults[0].id }
      } else {
        res.send({ status: 200, message: "Please Add to Cart", data: { stockId } });
      }
    });



    // Check if the stock_id already exists in the cart for this user
    // const checkCartQuery = `SELECT id FROM cart WHERE user_id = ? AND stocks_id  = ?`;
    // dbutil.sqlinjection(sqldb.MySQLConPool, checkCartQuery, [userId, stockId], "in checkCart", function (err, cartCheckResults) {
    //   if (err) {
    //     console.error("Error checking cart:", err);
    //     return res.status(400).send({ status: 400, error: "Failed to check cart" });
    //   }

    //   if (cartCheckResults.length > 0) {
    //     // Product already exists in the cart
    //     return res.status(200).send({ status: 200, message: "selected Product is already available in the cart", data: { cartId: cartCheckResults[0].id } });
    //   }




    // });



    // UserModel.addToCart(userId, stockId, function (err, results) {
    //   if (err) {
    //     console.error("Error Inserting stockId into CART tbl:", err.message);
    //     return res.send({ status: 500, msg: "Server Error" });
    //   }
    //   res.send({ status: 200, data: results });
    // });




  });
};


//check stock Availability (case: AddToCart)
exports.checkStockAvailbilityForAddToCartCtrl = function (req, res) {
  console.log("req body in stockavailabilityForAddToCart:", req.body);

  UserModel.checkStockAvailbility(req.body, function (err, results) {
    if (err) {
      console.error("Database error:", err);
      return res.status(400).send({ status: 400, error: err.message || "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).send({ status: 400, error: "No matching stock found" });
    }

    // If stock exists, get the stock ID
    const stockId = results[0].id;
    const productId = results[0].product_id;
    console.log(`Found stock ID:-${stockId} and productId:-${productId}`);

    const userId = req.user?.Id; // user ID is available from auth middleware
    if (!userId) {
      return res.status(401).send({ status: 401, error: "User not authenticated" });
    }

    //addToCart
    UserModel.addToCart(userId, stockId, productId, function (err, results) {
      if (err) {
        console.error("Error Inserting stockId into CART tbl:", err.message);
        return res.send({ status: 500, error: "Server Error" });
      }
      res.send({ status: 200, message: "Product added to cart successfully", data: results, userID: userId });
    });
  });
};


//cartItemsCount
exports.getCartInfoCountCtrl = function (req, res) {

  UserModel.getCartInfoCount(function (err, results) {
    if (err) {
      console.error("Error fetching CART info:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }

    if (results.length > 0) {
      res.send({ status: 200, data: results });
    }

  })

}

//postDeliveryType
exports.postDeliveryTypeCtrl = function (req, res) {
  console.log("req body in deliverytype cntrl:", req.body);

  const { key, price, userId } = req.body;

  UserModel.postDeliveryType(key, price, userId, function (err, results) {
    if (err) {
      console.error("Error Inserting delivery type into cart tbl:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  });

}

//removeItemFromCart
exports.removeItemFromCartCtrl = function (req, res) {
  const { id } = req.query;
  console.log("Captured id in removeItemFromCart:", id);

  UserModel.removeItemFromCart(id, function (err, results) {
    if (err) {
      console.error("Error Removing item from cart tbl:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });

  });
}



/**------------------dashboard----------------------- */
exports.getAllSubcategoriesCtrl = function (req, res) {
  UserModel.getAllSubcategories(function (err, results) {
    if (err) {
      console.error("Error fetching sub-categories:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  });
}


//post sub-category products
exports.subCtgryProductsCtrl = function (req, res) {
  console.log("req body is..", req.body);

  // const { subCategory_id } = req.body;
  // console.log("captured subcategory id in subCtgryProductsCtrl:", subCategory_id);

  // if (!subCategory_id) {
  //   return res.send({ status: 400, error: "subCategory ID is required" });
  // }

  UserModel.addSubCategoryProducts(req.body, function (err, results) {
    if (err) {
      console.error("Error inserting into products table:", JSON.stringify(err));
      return res.send({ status: 500, error: "Failed to insert subcategory_id in PRODUTS" });
    }

    if (!results || !results.insertId) {
      return res.send({ status: 500, error: "No insertId returned from PRODUCTS insert" });
    }

    const productId = results.insertId;
    console.log("New product record is inserted with ID-", productId);

    //check subcategory_id inserted into products and get the "productid"
    // if (results && productId) {

    //   //stocks
    //   UserModel.addProductId(productId, function (err, results) {
    //     if (err) {
    //       console.error("Error inserting into STOCKS table:", JSON.stringify(err));
    //       return res.send({ status: 500, error: "Failed to insert productid into STOCKS" });
    //     }
    //     res.send({ status: 200, msg: `Subcategory_id has been Inserted into Products successfully` });
    //   });

    // } else {
    //   res.send({ status: 500, msg: `Failed to insert Subcategory_id into PRODUCTS & get productid` });
    // }

    res.send({ status: 200, msg: `Subcategory id has been Inserted into Products successfully` });
  });
}


//get all subcategoryproduct items
exports.getSubctrgyProductsItemsCtrl = function (req, res) {
  UserModel.getSubctrgyProductItems(function (err, results) {
    if (err) {
      console.error("Error fetching sub-categories:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  });
}


//postStockVariants
exports.postStockVariantsCtrl = function (req, res) {
  console.log("req body in poststocksvaraints:", req.body);

  UserModel.postStockVariants(req.body, function (err, results) {
    if (err) {
      console.error("Error inserting colors-title in stocks:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  });
}

//getAllSpecifications
exports.getAllSpecificationsCtrl = function (req, res) {
  UserModel.getAllSpecifications(function (err, results) {
    if (err) {
      console.log("Error retreving specifications:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  })
}


//post ProductSpecifications
exports.postProductSpecificationsCtrl = function (req, res) {
  const cntxtDtls = "in postProductSpecificationsCtrl";
  const { product_id, specifications } = req.body;

  // Validate inputs
  if (!product_id || !Array.isArray(specifications) || specifications.length === 0) {
    console.error(`${cntxtDtls}: Product ID and at least one specification are required`);
    return res.send({ status: 400, msg: "Product ID and at least one specification are required" });
  }

  // Whitelist of allowed columns for non-fabric specifications
  const allowedColumns = [
    "Fabric_Type_One",
    "Fabric_Type_Two",
    "Fabric_Type_Three",
    "Sleeve_Length",
    "Collar",
    "Fit",
    "Brand_Fit_Name",
    "Print_or_Pattern_Type",
    "Occasion"
  ];

  // Validate fabric specifications (up to three)
  const fabricSpecs = specifications.filter((spec) => spec.quality_type_key.toLowerCase() === "fabric");
  if (fabricSpecs.length > 3) {
    console.error(`${cntxtDtls}: Up to three fabric specifications are allowed`);
    return res.send({ status: 400, msg: "Up to three fabric specifications are allowed" });
  }

  const columns = ["product_id"];
  const values = [product_id];
  const placeholders = ["?"];

  // Map fabric specifications to Fabric_Type_One, Fabric_Type_Two, Fabric_Type_Three
  fabricSpecs.forEach((spec, index) => {
    if (!spec.quality_type_key || !spec.quality_type_value) {
      console.error(`${cntxtDtls}: Key and value are required for fabric specification`);
      return res.send({ status: 400, msg: "Key and value are required for fabric specification" });
    }
    const columnName = `Fabric_Type_${index + 1}`;
    columns.push(`\`${columnName}\``);
    values.push(spec.quality_type_value);
    placeholders.push("?");
  });

  // Add non-fabric specifications
  const nonFabricSpecs = specifications.filter((spec) => spec.quality_type_key.toLowerCase() !== "fabric");
  for (const spec of nonFabricSpecs) {
    const { quality_type_key, quality_type_value } = spec;
    if (!quality_type_key || !quality_type_value) {
      console.error(`${cntxtDtls}: Key and value are required for all specifications`);
      return res.send({ status: 400, msg: "Key and value are required for all specifications" });
    }
    const sanitizedKey = quality_type_key.replace(/[^a-zA-Z0-9_ ]/g, "");
    if (!allowedColumns.includes(sanitizedKey)) {
      console.log("col name:", sanitizedKey);
      console.error(`${cntxtDtls}: Invalid column name: ${sanitizedKey}`);
      return res.send({ status: 400, msg: `Invalid column name: ${sanitizedKey}` });
    }
    columns.push(`\`${sanitizedKey}\``);
    values.push(quality_type_value);
    placeholders.push("?");
  }

  UserModel.postProductSpecifications({ columns, values }, function (err, results) {
    if (err) {
      console.error(`${cntxtDtls}: Failed to add specifications - ${err.message}`);
      return res.send({ status: 500, msg: "Server Error", details: err.message });
    }
    res.send({ status: 200, msg: "Specifications added successfully", data: results });
  });
};

//get product colors
exports.getProductColorCtrl = function (req, res) {
  console.log("req query is...", req.query);

  const { product_id } = req.query;

  console.log("captured product id in colors:", product_id);

  UserModel.getProductColor(product_id, function (err, results) {
    if (err) {
      console.error("Error fetching product colors:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  });
}

//get product sizes
exports.getProductSizesCtrl = function (req, res) {
  const { product_id } = req.query;
  console.log("product size in cntrl:", product_id);

  UserModel.getProductSizes(product_id, function (err, results) {
    if (err) {
      console.error("Error fetching product colors:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  });
}

//get specifications info
exports.getSpecificationsInfoCtrl = function (req, res) {
  const { product_id } = req.query;

  UserModel.getSpecificationsInfo(product_id, function (err, results) {
    if (err) {
      console.error("Error fetching specifications info:", err.message);
      return res.send({ status: 500, msg: "Server Error" });
    }
    res.send({ status: 200, data: results });
  });
}