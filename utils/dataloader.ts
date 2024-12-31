import { readFileSync } from 'fs';
import path from 'path';

export function getDataAsins(): string[] {
    const filePath = path.resolve(__dirname, 'items.json'); // Asegúrate de ajustar la ruta si es necesario
    const rawData = readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    return jsonData.items; // Devuelve el array de items
}