// src/utils/dataExport.ts
import { storageService } from '@/utils/storage';

export class DataExportService {
  static async exportAllData(): Promise<string> {
    return await storageService.exportAllData();
  }

  static async importAllData(jsonData: string): Promise<void> {
    await storageService.importAllData(jsonData);
  }

  static downloadExportFile(jsonData: string, filename: string = 'goodskeeper-backup.json') {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async handleFileImport(file: File): Promise<void> {
    const text = await file.text();
    await this.importAllData(text);
  }
}