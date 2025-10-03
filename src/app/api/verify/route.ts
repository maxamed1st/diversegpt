import type { TurnstileServerValidationResponse } from '@marsidev/react-turnstile'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const captchaSchema = z.object({
  token: z.string().min(1),
  redirectPath: z.string(),
});

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { token, redirectPath } = captchaSchema.parse(body)
		const secret = process.env.TURNSTILE_SECRET_KEY!

		const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		})

		const data: TurnstileServerValidationResponse = await result.json()
		if (!data.success) {
			return new Response(JSON.stringify(data), {
				status: 400,
				headers: {
					'content-type': 'application/json'
				}
			})
		}

		const res = NextResponse.json({ success: true, redirectPath: redirectPath });
		res.cookies.set('captchaVerified', 'true', {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 120,
			path: '/',
		});

		return res;
	} catch (error) {
		console.error('Error during captcha verification:', error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: {
				'content-type': 'application/json'
			}
		})
	}
}