import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query;
    console.log(url, "herei surl")
    try {
      const response = await fetch(url as string);
      const html = await response.text();
      
      // Modify headers to allow embedding
      const modifiedHtml = html
        .replace(/x-frame-options: .*/gi, '')
        .replace(/content-security-policy: .*frame-ancestors.*/gi, '');
  
      res.status(200).send(modifiedHtml);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load content' });
    }
  }

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch content: ${response.status} ${response.statusText}` }, 
        { status: response.status }
      );
    }
    
    const contentType = response.headers.get('content-type') || 'text/html';
    const html = await response.text();
    
    // Modify HTML to allow embedding
    const modifiedHtml = html
      .replace(/<meta[^>]*http-equiv=['"]X-Frame-Options['"][^>]*>/gi, '')
      .replace(/<meta[^>]*http-equiv=['"]Content-Security-Policy['"][^>]*>/gi, '');
    
    // Create a new response with modified headers
    const newResponse = new NextResponse(modifiedHtml, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Add headers to allow embedding
        'Access-Control-Allow-Origin': '*',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': "frame-ancestors 'self' *"
      }
    });
    
    return newResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
  }
}