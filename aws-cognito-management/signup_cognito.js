import AmazonCognitoIdentity from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'your_poolid',
  ClientId: 'your_clientid',
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const cognito = new AWS.CognitoIdentityServiceProvider();


const signUpCognito = async (req, res) =>{

    return new Promise((resolve, reject) => {
      try {
        const {first_name, last_name, email, password, gender, phone  } = req.body;

          console.log(req.body);
          console.log("this is body data ====");
        
          var fullName = first_name+" "+last_name;

          console.log(fullName);
          console.log("this is full name ===");

          const attributeList = [
              new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'name', Value: fullName }),
              new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email }),
              new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'phone_number', Value: phone }),
              new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'gender', Value: gender }), // Include the "gender" attribute
              new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'locale', Value: 'en_US' }) // Include the "locale" attribute
            ];

            console.log(attributeList);
            console.log("checking attribute list ====");
        
            userPool.signUp(email, password, attributeList, null, (err, data) => {
              if (err) {
                // reject(err);
                console.log(err);
                console.log("this is error value ====");
                if(err.code == "InvalidPasswordException"){
                  req.session.message = "Password must Contains at least 1 number, Contains at least 1 special character,1 uppercase letter and 1 lowercase letter.";
                  res.redirect("/register");
                }
                else if(err.code == "UsernameExistsException"){
                  req.session.message = "Username already exists";
                  res.redirect("/register");
                }else{
                  req.session.message = "Unable to register.";
                  res.redirect("/register");
                }
               
              }else{
                console.log("signup data");
                console.log(data);
                resolve(data);
              } 
            });
      } catch (error) {
        console.log("this is error message ====");
        console.log(error);
        req.session.message = "An Error occurred.";
        res.redirect("/register");
      }
    });
} 
