import AmazonCognitoIdentity from 'amazon-cognito-identity-js';

const updateCognitoPassword = async (username,password,oldpassword) => {
  try{
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: username,
    Password: oldpassword,
});

var userData = {
    Username: username,
    Pool: userPool
};
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
        cognitoUser.changePassword(oldpassword, password, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully changed password of the user.");
                console.log(result);
            }
        });
    },
    onFailure: function (err) {
        console.log(err);
    },
});
  }catch(err){
    console.log(err);
  }
};