import AmazonCognitoIdentity from 'amazon-cognito-identity-js';

userLogin = async (req, res) =>{

        try {
          const {email, password} = req.body;

          const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
              Username: email,
              Password: password
          });

          const userData = {
            Username: email,
            Pool: userPool
        };

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: async (resultdata) =>{
                let accessToken = resultdata.getAccessToken().getJwtToken();
                let idToken = resultdata.getIdToken().getJwtToken();
                let refreshToken = resultdata.getRefreshToken().getToken()
                const decoded = jwt.decode(accessToken, { complete: true });
                const iddecode = jwt.decode(idToken, { complete: true });
                const refreashdecode = jwt.decode(refreshToken, { complete: true });
                if(iddecode && iddecode.payload){
                  req.session.cognito_email = iddecode.payload.email;
                  req.session.cognito_name = iddecode.payload.name;
                }

                if(req.session.cognito_email){
                  let result = await UserModel.findOne({email:req.session.cognito_email});
                  // let result = await UserModel.findOne({email:email});
                  if(result != null && result.status != "reset_required"){
                    const isMatch = await bcrypt.compare(password, result.password);
                    if(result.email == email && isMatch){
                      req.session.userId = result._id;
                      req.session.email = email;
                      const userSession = new UserSessionModel({
                        userId: result._id,
                        userEmail: email,
                        // You can add more fields here if needed
                      });
                      await userSession.save();

                      res.redirect("/portal/dashboard");
                    }else{
                      req.session.message = 'Email or Password not valid.';
                      res.redirect('/login');
                    }
                  }
                  else if(result.status == "reset_required"){
                    req.session.message = '<span class="text-danger">Your password is reset. Reset code is sent to your email address. <a href="/reset-password" class=""><u>Click here</u></a> to get new password.</span>';
                    res.redirect('/login');
                  }
                  else{
                    req.session.message = 'You are not a registered user.';
                    res.redirect('/login');
                    // res.send(req.session.message);
                  }
                  // res.send(result);
                }else{
                  res.send("you are not authenticate user");
                }
              },
            onFailure: err => {
               console.log(err);
               console.log("check failed error ===");
                // res.send(err);
                if(err.name == "NotAuthorizedException"){
                  req.session.message = 'You are not a registered user.';
                  res.redirect('/login');
                }
                else if(err.name == "PasswordResetRequiredException"){
                  res.redirect('/reset-password');
                }
                else{
                  req.session.message = "Unable to logged in";
                  res.redirect('/login');
                }
               
            },

          });

        } catch (error) {
            console.log("user login error is this -----");
            console.log(error);
            req.session.message = "Unable to logged in";
            res.redirect('/login');
        }


      
    }