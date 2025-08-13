const sqldb = require("../config/db");
const dbutil = require("../utils/dbutils");

//user_Registration
exports.addRegisterFormInfo = function (data, callback) {
  const cntxtDtls = "in addRegisterFormInfo";
  const QRY_TO_EXEC = `INSERT INTO user_registration(name, phonenumber, email) VALUES (?,?,?);`
  let paramsdata = [data.name, data.phone, data.email];
  console.log("register info is...", paramsdata);
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      callback(err, results);
    });
  } else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls);
  }
}

//user
exports.addUser = async function (registrationId, name, callback) {
  const cntxtDtls = "in addUser";
  const QRY_TO_EXEC = `INSERT INTO users(registration_id, name) VALUES (?,?);`;
  let paramsdata = [registrationId, name];
  console.log("register 'user' info is...", paramsdata);
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      callback(err, results);
      return;
    });
  } else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls);
  }
}

//login
exports.loginFormInfo = function (phonenumber, callback) {
  const cntxtDtls = "in loginFormInfo";
  const QRY_TO_EXEC = `SELECT * FROM user_registration WHERE phonenumber = ?;`
  //let paramsdata = [data.phonenumber];
  console.log("login Db data is...", phonenumber);
  if (callback && typeof callback == "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, phonenumber, cntxtDtls, function (err, results) {

      if (err) {
        return callback(err, null); //pass sql error to callback
      }

      if (results.length === 0) {
        return callback(new Error("Sorry! You Don't have an Account Please SignUP"), null);
      }

      //user found pass "results" to callback
      callback(null, results)
      //callback(err, results);
      return;
    });
  } else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
  }
}

//store OTP
exports.storeOtp = function (phone, otp, callback) {
  const expires = new Date(Date.now() + 30 * 1000); //otp expires in 30sec
  const cntxtDtls = "in storeOtp";
  const QRY_TO_EXEC = `UPDATE user_registration SET otp = ?, otp_expires = ? WHERE phonenumber = ?;`;
  const paramsdata = [otp, expires, phone];
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  } else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls);
  }
}

//verify OTP
exports.verifyOtp = function (phone, otp, callback) {
  const cntxtDtls = "in verifyOtp";
  const QRY_TO_EXEC = `SELECT otp, otp_expires from user_registration WHERE phonenumber = ?;`;
  const paramsdata = [phone];
  console.log(`params data otp-${otp} for ${phone}`);
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      if (err) {
        return callback(err);
      }

      const user = results[0];
      console.log("user is...", user);

      console.log(`stored otp-${user.otp} enterd otp-${otp}`);

      if (user.otp !== otp) {
        console.log("otp missmatched");
        return callback(null, false, "Invalid OTP-mismatched");
      }

      if (new Date(user.otp_expires) < new Date()) {
        console.log("otp expired");
        return callback(null, false, "OTP expired");
      }

      return callback(null, results);
    });
  } else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls);
  }
}


//check user exists or not
exports.selectUserRegister = function (data, callback) {
  var cntxtDtls = "in getAlreadyRegisterInfo";
  var QRY_TO_EXEC = `SELECT id, name, phonenumber FROM user_registration WHERE phonenumber = ?;`;

  if (!data || !data.Phone) {
    return callback(new Error("Phone number is required"), null);
  }

  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [data.Phone], cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error executing query - ${err.message}`);
        return callback(err, null);
      }
      callback(null, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls);
  }
}

//update user "category"
exports.updateUserCategory = function (registrationId, name, categoryId, callback) {
  const cntxtDtls = "in updateUserCategory";

  //check if user exists in users table
  const QRY_TO_EXEC = `SELECT id FROM users WHERE registration_id = ?;`;
  dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [registrationId], cntxtDtls, (err, results) => {
    if (err) {
      console.error("Error checking user:", err.message);
      return callback(err, null);
    }

    if (results && results.length > 0) {
      // User exists, update category_id
      const QRY_UPDATE = `UPDATE users SET name = ?, category_id = ? WHERE registration_id = ?`;
      dbutil.sqlinjection(sqldb.MySQLConPool, QRY_UPDATE, [name, categoryId, registrationId], cntxtDtls, (err, results) => {
        callback(err, results);
      });
    } else {
      // User does not exist, insert new record (assuming name is fetched or provided)
      const QRY_INSERT = `INSERT INTO users (registration_id, name, category_id) VALUES (?, ?, ?)`;
      dbutil.sqlinjection(sqldb.MySQLConPool, QRY_INSERT, [registrationId, name, categoryId], cntxtDtls, (err, results) => {
        callback(err, results);
      });
    }
  });
}

//add user "category"
// exports.addUserCategory = function (registrationId, name, categoryId, callback) {
//   const cntxtDtls = "in addUserCategory";
//   const QRY_TO_EXEC = `INSERT INTO users (registration_id, name, category_id ) VALUES (?,?,?);`;
//   let paramsdata = [registrationId, name, categoryId];

//   console.log(`${cntxtDtls}: Inserting user category with params -`, paramsdata);
//   if (callback && typeof callback === "function") {
//     dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
//       if (err) {
//         console.error(`${cntxtDtls}: Error inserting user category - ${err.message}`);
//         return callback(err, null);
//       }
//       callback(null, results);
//     });
//   } else {
//     throw new Error("Callback function is required");
//   }
// }

//All categories

exports.getAllCtgrs = function (callback) {
  const cntxtDtls = "in getAllCategories";
  const QRY_TO_EXEC = `SELECT * FROM categories WHERE d_ind = 0;`;
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls, function (err, results) {
      callback(err, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls);
  }
}

//post category
exports.postCtgry = function (data, callback) {
  const cntxtDtls = "in addCategoryId";
  const QRY_TO_EXEC = `INSERT INTO sub_categories(category_id) VALUES (?);`;
  let paramsdata = [data.categoryId];
  console.log("categoryId is captured in postCtgry model...", paramsdata);
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      callback(err, results);
    });
  } else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls);
  }

}

//sub-categories data
exports.getSubCategories = function (category_id, callback) {
  //console.log("categoryId in subcategories model..", category_id);
  const cntxtDtls = "in getAllSubCategories";
  const QRY_TO_EXEC = `SELECT id, title FROM sub_categories WHERE category_id = ?;`;

  if (!category_id) {
    return callback(new Error("Category ID is required"), null);
  }

  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [category_id], cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error executing query - ${err.message}`);
        return callback(err, null);
      }
      callback(null, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls);
  }

}

exports.getSubctrgyProductsInfo = function (subcategory_id, callback) {
  const cntxtDtls = "in getSubctrgyProductsInfo";
  const QRY_TO_EXEC = `SELECT * FROM products WHERE subcategory_id = ?;`;

  if (!subcategory_id) {
    return callback(new Error("Sub-Category ID is required"), null);
  }

  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [subcategory_id], cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error executing query - ${err.message}`);
        return callback(err, null);
      }
      callback(null, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls);
  }
}


exports.getProductDetailInfo = function (productId, callback) {
  console.log("productId is captured in productDetail info model:- ", productId);

  const cntxtDtls = "in getProductDetailInfo";
  const QRY_TO_EXEC = `SELECT * FROM products WHERE id = ?;`;

  if (!productId) {
    return callback(new Error("Sub-Category ID is required"), null);
  }

  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [productId], cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error executing query - ${err.message}`);
        return callback(err, null);
      }
      callback(null, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls);
  }

}


//check stockAvailability
exports.checkStockAvailbility = function (data, callback) {
  const cntxtDtls = "in checkStockAvailability";
  const QRY_TO_EXEC = `SELECT id, product_id, sizes FROM stocks WHERE product_id = ? AND stocks_variant_id = ? AND size_id = ?;`;
  const paramsdata = [data.product_id, data.stocks_variant_id, data.size_id];
  console.log("data is..", data);
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  } else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls);
  }

};

//check cartRecord
exports.checkCartRecord = function (userId, stockId, callback) {
  const cntxtDtls = "in checkCartRecord"
  const QRY_TO_EXEC = `SELECT id FROM cart WHERE user_id = ? AND stocks_id  = ?`;
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [userId, stockId], cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error executing query - ${err.message}`);
        return callback(err, null);
      }
      callback(null, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls);
  }
}

//addTocart
exports.addToCart = function (userId, stockId, productId, callback) {
  const cntxtDtls = "in addToCart";
  const QRY_TO_EXEC = `INSERT INTO cart (user_id, stocks_id, product_id) VALUES (?, ?, ?);`;
  let paramsdata = [userId, stockId, productId];

  console.log(`${cntxtDtls}: Inserting stocksId into CART -`, paramsdata);
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error inserting user category - ${err.message}`);
        return callback(err, null);
      }
      callback(null, results);
    });
  } else {
    throw new Error("Callback function is required");
  }
}


exports.getCartInfoCount = function (callback) {
  const cntxtDtls = "in getCartInfoCount";
  const QRY_TO_EXEC = `SELECT * FROM cart`;
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error inserting user category - ${err.message}`);
        return callback(err, null);
      }
      callback(null, results);
    });
  } else {
    throw new Error("Callback function is required");
  }
}

exports.postDeliveryType = function (key, price, userId, callback) {
  const cntxtDtls = "in postDeliveryType";
  const QRY_TO_EXEC = `UPDATE cart SET delivery_type = ?, deliveryType_price = ? WHERE user_id = ?;`;
  let paramsdata = [key, price, userId];

  console.log(`${cntxtDtls}: Inserting delivery type into CART -`, paramsdata);
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error inserting user category - ${err.message}`);
        return callback(err, null);
      }
      callback(null, results);
    });
  } else {
    throw new Error("Callback function is required");
  }

}

//remove item from cart
exports.removeItemFromCart = function (id, callback) {
  const cntxtDtls = "in removeItemFromCart";
  const QRY_TO_EXEC = `DELETE FROM cart WHERE id = ?;`;
  let paramsdata = [id];

  console.log(`${cntxtDtls}:-`, paramsdata);
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error Remove item from CART - ${err.message}`);
        return callback(err, null);
      }
      callback(null, results);
    });
  } else {
    throw new Error("Callback function is required");
  }

}


/*-----dashboard--------*/

//get all subcategories
exports.getAllSubcategories = function (callback) {
  const cntxtDtls = "in getAllSubCategories";
  const QRY_TO_EXEC = `SELECT id, title FROM sub_categories;`;
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls, function (err, results) {
      callback(err, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls);
  }
}


//add subcategory-id into
exports.addSubCategoryProducts = function (data, callback) {
  const cntxtDtls = "in addSubCategoryProducts";
  const QRY_TO_EXEC = `INSERT INTO products(subcategory_id, name, description, MRP, discount, rating, reviews, image) VALUES(?,?,?,?,?,?,?,?);`;

  console.log("data is..", data);
  //const { subCategoryId, title, description, mrp, discount, rating, views, image } = data;
  let paramsdata = [data.subCategoryId, data.title, data.description, data.mrp, data.discount, data.rating, data.views, data.image];

  //console.log("sub-category info captured in 'addSubCategoryProducts'model..", paramsdata);

  console.log(`${cntxtDtls}: Inserting sub-category-id with params -`, paramsdata);
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error inserting user category - ${err.message}`);
        return callback(err, null);
      }
      callback(null, results);
    });
  } else {
    throw new Error("Callback function is required");
  }
}

//getSubctrgyProductItems
exports.getSubctrgyProductItems = function (callback) {
  const cntxtDtls = "in getSubctrgyProductsItems";
  const QRY_TO_EXEC = `SELECT id,name FROM products WHERE d_ind = 0;`;

  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls, function (err, results) {
      callback(err, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls);
  }
}


exports.postStockVariants = function (data, callback) {
  const cntxtDtls = "in postStockVariants";
  const QRY_TO_EXEC = `INSERT INTO stocks_variants(product_id, color_name) VALUES(?,?);`;

  console.log("data is..", data);
  let paramsdata = [data.productItemId, data.title];

  console.log(`${cntxtDtls}: Inserting sub-category-id with params -`, paramsdata);
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error inserting user category - ${err.message}`);
        return callback(err, null);
      }
      callback(null, results);
    });
  } else {
    throw new Error("Callback function is required");
  }
}


exports.getAllSpecifications = function (callback) {
  const cntxtDtls = "in getAllSpecifications";
  const QRY_TO_EXEC = `SELECT * FROM product_quality WHERE  d_ind = 0;`;
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls, function (err, results) {
      callback(err, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [], cntxtDtls);
  }
}

exports.postProductSpecifications = function (data, callback) {
  const cntxtDtls = "in postProductSpecifications";

  // Validate input
  if (!data.columns || !Array.isArray(data.columns) || data.columns.length < 1 ||
    !data.values || !Array.isArray(data.values) || data.values.length < 1 ||
    data.columns.length !== data.values.length) {
    const err = new Error("Invalid columns or values provided");
    console.error(`${cntxtDtls}: ${err.message}`);
    return callback(err, null);
  }

  // Construct dynamic query
  const QRY_TO_EXEC = `INSERT INTO specifications (${data.columns.join(", ")}) VALUES (${data.columns.map(() => "?").join(", ")});`;

  const paramsdata = data.values;

  console.log(`${cntxtDtls}: Inserting specifications with params -`, paramsdata);

  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
      if (err) {
        console.error(`${cntxtDtls}: Error inserting specifications - ${err.message}`);
        return callback(err, null);
      }
      console.log(`${cntxtDtls}: Successfully inserted specifications`);
      callback(null, results);
    });
  } else {
    const err = new Error("Callback function is required");
    console.error(`${cntxtDtls}: ${err.message}`);
    throw err;
  }
}


//add specifications
// exports.addSpecId = async function (specId, callback) {
//   const cntxtDtls = "in addspecificationsId";
//   const QRY_TO_EXEC = `INSERT INTO stocks(specification_id) VALUES (?);`;
//   let paramsdata = [specId];
//   console.log("stock specification_id is...", paramsdata);

//   if (callback && typeof callback === "function") {
//     dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls, function (err, results) {
//       callback(err, results);
//       return;
//     });
//   } else {
//     return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, paramsdata, cntxtDtls);
//   }
// }


exports.getProductColor = function (productId, callback) {
  const cntxtDtls = "in getProductColor";
  const QRY_TO_EXEC = `SELECT * FROM stocks_variants WHERE product_id = ?;`;
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [productId], cntxtDtls, function (err, results) {
      callback(err, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [productId], cntxtDtls);
  }
}


exports.getProductSizes = function (productId, callback) {
  const cntxtDtls = "in getProductColor";
  const QRY_TO_EXEC = `SELECT size_id, sizes FROM stocks WHERE product_id = ?;`;
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [productId], cntxtDtls, function (err, results) {
      callback(err, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [productId], cntxtDtls);
  }
}


exports.getSpecificationsInfo = function (productId, callback) {
  const cntxtDtls = "in getSpecificationsInfo";
  const QRY_TO_EXEC = `SELECT * FROM specifications WHERE product_id = ?;`;
  if (callback && typeof callback === "function") {
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [productId], cntxtDtls, function (err, results) {
      callback(err, results);
    });
  }
  else {
    return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [productId], cntxtDtls);
  }
}