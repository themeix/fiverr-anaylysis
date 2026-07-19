import * as fs from 'fs';
import * as path from 'path';
import { Progress } from '../types/index.js';

export class ProgressManager {
  private filePath: string;
  private progress: Progress;

  constructor(filePath: string = 'progress.json') {
    this.filePath = filePath;
    this.progress = this.load();
  }

  private load(): Progress {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading progress file:', error);
    }

    return {
      processedProfiles: [],
      lastProcessed: '',
      mode: 'buyer'
    };
  }

  private save(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.progress, null, 2));
    } catch (error) {
      console.error('Error saving progress file:', error);
    }
  }

  isProcessed(profile: string): boolean {
    return this.progress.processedProfiles.includes(profile);
  }

  markProcessed(profile: string): void {
    if (!this.isProcessed(profile)) {
      this.progress.processedProfiles.push(profile);
      this.progress.lastProcessed = profile;
      this.save();
    }
  }

  setMode(mode: 'buyer' | 'seller'): void {
    this.progress.mode = mode;
    this.save();
  }

  getProgress(): Progress {
    return { ...this.progress };
  }

  reset(): void {
    this.progress = {
      processedProfiles: [],
      lastProcessed: '',
      mode: 'buyer'
    };
    this.save();
  }
}