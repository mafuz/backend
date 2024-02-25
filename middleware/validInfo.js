module.exports = function(req, res, next, err) {
    const { username, email, firstname, lastname, password, roles, active, phone } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      console.log(!email.length);
      if (![username, email, firstname, lastname, password, roles, active, phone].every(Boolean)) {
        return res.err("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.err("Invalid Email");
      }
    } else if (req.path === "/login") {
      console.log(!email.length);
      if (![username, password].every(Boolean)) {
        return res.err("Missing Credentials");
      } 
    //   else if (!validEmail(email)) {
    //     return res.json("Invalid Email");
    //   }
    }
  
    next();
  };
  