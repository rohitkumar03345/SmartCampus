import jwt from 'jsonwebtoken';
export function auth(req,res,next){const token=(req.headers.authorization||'').replace(/^Bearer /,'');try{req.user=jwt.verify(token,process.env.JWT_SECRET||'dev-only-change-this-secret');next()}catch{return res.status(401).json({error:'Please sign in to continue.'})}}
export function allow(...roles){return(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({error:'You do not have access to this action.'})}
