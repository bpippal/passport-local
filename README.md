# passport-local
Simple passport-local implementation to show login,register and authentication features

Included routes ---> <br>
1) /  -> Only logged in user should be able to view this, if not logged in and user goes to this, user is redirected.
2) /login  -> Login endpoint.
3) /register  -> Register endpoint
<br>
User related data is stored at server level.
<br>
These route's are rendered using EJS. 
<br><br>
Impletemented /logout route to clear the session and to logout the user.
<br><br>
Included some check's such as if a user is logged in, they should not be able to view /login or /register and instead they will they redirected to /
