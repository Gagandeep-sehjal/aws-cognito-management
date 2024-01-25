const disableUser = async (username) => {

    return new Promise((resolve, reject) => {
        
        const user_name = username;

        const params = {
          UserPoolId: userPoolId,
          Username: user_name,
        };

        cognito.adminDisableUser(params, function (err, data) {
          if (err) {
            console.log("Changing cognito error:");
            console.error(err, err.stack);
            // Handle error
            reject(err);
          } else {
            console.log(data);
            console.log('User status updated successfully');
            // User status updated successfully
            resolve(data);
          }
        });
    });
};

const enableUser = async (username) => {

    return new Promise((resolve, reject) => {
        
        const user_name = username;

        const params = {
          UserPoolId: userPoolId,
          Username: user_name,
        };

        cognito.adminEnableUser(params, function (err, data) {
          if (err) {
            console.log("Changing cognito error:");
            console.error(err, err.stack);
            // Handle error
            reject(err);
          } else {
            console.log(data);
            console.log('User status updated successfully');
            // User status updated successfully
            resolve(data);
          }
        });
    });
};