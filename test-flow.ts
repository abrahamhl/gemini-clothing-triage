import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log("=== RUNNING PRODUCTION BEHAVIOR TEST ===\n");
  const BASE_URL = 'http://localhost:3006';
  
  // Create a dummy 1x1 JPEG base64
  const dummyImg = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  try {
    console.log("1. Uploading single image to create item...");
    
    // Create blob for upload
    const buffer = Buffer.from(dummyImg, 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const formData1 = new FormData();
    formData1.append("images", blob, "image.jpg");
    formData1.append("source", "desktop");

    const res1 = await fetch(`${BASE_URL}/api/items`, {
      method: 'POST',
      body: formData1
    });
    
    console.log(`HTTP Status: ${res1.status}`);
    const data1 = await res1.json();
    const itemId = data1.items[0].id;
    console.log(`Created Item ID: ${itemId}`);
    
    console.log("\n2. Requesting AI analysis (expecting configuration error)...");
    const res2 = await fetch(`${BASE_URL}/api/items/${itemId}/analyze`, {
      method: 'POST'
    });
    console.log(`HTTP Status: ${res2.status}`);
    const data2 = await res2.json();
    console.log("API Response:", data2);
    
    console.log("\n3. Testing persistence (fetching item again)...");
    const res3 = await fetch(`${BASE_URL}/api/items/${itemId}`);
    console.log(`HTTP Status: ${res3.status}`);
    const data3 = await res3.json();
    console.log(`Item exists: ${!!data3.item} (Name: ${data3.item?.name})`);

    console.log("\n4. Testing 5 JPEGs bulk mode...");
    const formData4 = new FormData();
    for(let i=0; i<5; i++) formData4.append("images", blob, `image${i}.jpg`);
    formData4.append("source", "desktop");

    const res4 = await fetch(`${BASE_URL}/api/items`, {
      method: 'POST',
      body: formData4
    });
    console.log(`HTTP Status: ${res4.status}`);
    const data4 = await res4.json();
    console.log(`Created bulk items: ${data4.items.length}`);
    
    console.log("\nALL LOCAL TESTS COMPLETED (Proof of failure gathered).");

  } catch (e) {
    console.error("Test error:", e);
  }
}

main();
