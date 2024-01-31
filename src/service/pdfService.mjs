// Import pdfmake as an ES module
import pdfmake from 'pdfmake/build/pdfmake';

// Import vfs_fonts for pdfmake
import vfsFonts from 'pdfmake/build/vfs_fonts';

// Initialize pdfmake (use vfs_fonts if not using the CDN)
pdfmake.vfs = pdfmake.vfs || vfsFonts.pdfMake.vfs;

// Your other ESM code here...

// Define a service to generate and download a PDF
export const generatePdfService = (req, res) => {
  // Example content for the PDF
  const docDefinition = {
    content: [
      'Hello, this is a simple PDF document generated on the server using pdfmake.',
      { text: 'This is a bold text', bold: true },
      { text: '\n\nAnother paragraph' },
    ],
  };

  // Create a PDF buffer in memory
  const pdfBuffer = pdfmake.createPdf(docDefinition).getBuffer((buffer) => {
    // Set response headers for the PDF
    res.writeHead(200, {
      'Content-Type': 'application/pdf',                            // Set content type as PDF
      'Content-Disposition': 'attachment; filename=example.pdf',   // Set filename for download
      'Content-Length': buffer.length,                            // Set content length
    });

    // Send the PDF buffer as the response
    res.end(buffer);
  });
};



// PDF Content:

// Create an example PDF content using docDefinition. This can include text, formatting, and more.
// Generate PDF Buffer:

// Use pdfmake.createPdf(docDefinition) to create a PDF document.
// Call getBuffer() to get the PDF content as a buffer in memory.
// Set Response Headers:

// Set the appropriate HTTP headers for the response:
// 'Content-Type': 'application/pdf': Set the content type as PDF.
// 'Content-Disposition': 'attachment; filename=example.pdf': Prompt the browser to download the file with the specified filename.
// 'Content-Length': buffer.length: Set the content length.
// Send PDF Buffer as Response:

// Use res.end(buffer) to send the PDF buffer as the response to the client.