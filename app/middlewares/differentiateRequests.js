const differentiateRequests=(req,res,next)=>{
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        req.isApiRequest = true;
      } else {
        req.isApiRequest = false;
      }
      next();
}

module.exports=differentiateRequests;