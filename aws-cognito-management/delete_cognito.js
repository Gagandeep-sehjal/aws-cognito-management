const deleteUserParams = {
    UserPoolId: 'YOUR_USER_POOL_ID',
    Username: 'user@example.com',
  };
  
  cognito.adminDeleteUser(deleteUserParams, (deleteUserErr, deleteUserResult) => {
    if (deleteUserErr) {
      console.error('Error deleting user:', deleteUserErr);
    } else {
      console.log('User deleted successfully:', deleteUserResult);
    }
  });
  