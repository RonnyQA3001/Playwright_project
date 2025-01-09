import { readFileSync } from 'fs';
import path from 'path';

export function getDataAsins(): string[] {
    const filePath = path.resolve(__dirname, 'items.json');
    const rawData = readFileSync(filePath, 'utf-8');//Read the content from the items.JSON
    const jsonData = JSON.parse(rawData);//Converts rawData text into a JavaScript object.
    return jsonData.items; // Returns the array of items
}