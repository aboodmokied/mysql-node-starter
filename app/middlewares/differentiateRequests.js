const differentiateRequests=(req,res,next)=>{
  console.log(req.headers);
    if (req.path.startsWith('/api') || req.headers?.accept.includes('application/json')) {
        req.isApiRequest = true;
      } else {
        req.isApiRequest = false;
      }
      next();
}

module.exports=differentiateRequests;