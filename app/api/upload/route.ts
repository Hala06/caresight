import { NextResponse } from "next/server";
import Tesseract from "tesseract.js";
export async function POST(request: Request) {
 //request the form
 const formData = await request.formData();
 const file = formData.get('file')

    //process the file
    const process = await 
   


    //response
    return NextResponse.json({
        text: result},{status: 200})   
}
