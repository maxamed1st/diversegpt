import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth"

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith('/captcha')
	|| url.pathname.startsWith('/_next') 
	|| url.pathname.startsWith('/favicon.ico')
	|| (req.nextUrl.pathname === '/api/verify')) {
	  return NextResponse.next();
  }


  const verified = req.cookies.get('captchaVerified')?.value;

  if (!verified) {
    return NextResponse.redirect(new URL(`/captcha?redirectPath=${url.pathname}`, req.url));
  }
  
  return auth(req as any, NextResponse as any)
}