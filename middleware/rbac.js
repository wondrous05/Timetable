

const Admin = (req,res, next) => {
    if(req.user && req.user.role === 'admin') {

        return next()
    } else {
        return res.status(403).json({msg: 'unauthorized: only admin have access to this route'}

        )
    }
}


const Student = (req, res, next) => {
    if(req.user && req.user.role === 'Student') {

        return next()
}else {
    return res.status(403).json({message: 'Unauthorized: Only students  can access this route🙋🙋🙋'})
}}

    
    
    
    module.exports = {Admin, Student}