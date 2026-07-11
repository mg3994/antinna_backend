// Mock implementation of Google Apps Script services for local test execution

class MockCache {
  private store: Record<string, string> = {};
  public get(key: string): string | null {
    return this.store[key] || null;
  }
  public put(key: string, value: string, _exp?: number): void {
    this.store[key] = value;
  }
  public remove(key: string): void {
    delete this.store[key];
  }
}

class MockProperties {
  private store: Record<string, string> = {};
  public getProperty(key: string): string | null {
    return this.store[key] || null;
  }
  public setProperty(key: string, value: string): void {
    this.store[key] = value;
  }
  public deleteProperty(key: string): void {
    delete this.store[key];
  }
  public getProperties(): Record<string, string> {
    return { ...this.store };
  }
  public setProperties(props: Record<string, string>, deleteAll = false): void {
    if (deleteAll) this.store = {};
    Object.assign(this.store, props);
  }
  public deleteAllProperties(): void {
    this.store = {};
  }
}

class MockSheet {
  private values: any[][] = [];
  constructor(public name: string) {}
  public getName(): string { return this.name; }
  public getLastRow(): number { return this.values.length; }
  public getLastColumn(): number { return this.values[0]?.length || 0; }
  public getRange(row: number, col: number, numRows = 1, numCols = 1): any {
    // Fill values array up to dimensions
    while (this.values.length < row + numRows - 1) {
      this.values.push([]);
    }
    const resultValues: any[][] = [];
    for (let r = 0; r < numRows; r++) {
      const rowValues = this.values[row - 1 + r] || [];
      while (rowValues.length < col + numCols - 1) {
        rowValues.push('');
      }
      this.values[row - 1 + r] = rowValues;
      resultValues.push(rowValues.slice(col - 1, col - 1 + numCols));
    }

    return {
      getValues: () => resultValues,
      setValues: (newVals: any[][]) => {
        for (let r = 0; r < numRows; r++) {
          for (let c = 0; c < numCols; c++) {
            this.values[row - 1 + r][col - 1 + c] = newVals[r][c];
          }
        }
      },
      clear: () => {},
      getLastRow: () => this.values.length,
      getLastColumn: () => this.values[0]?.length || 0
    };
  }
  public appendRow(rowContents: any[]): void {
    this.values.push(rowContents);
  }
  public deleteRow(rowPosition: number): void {
    this.values.splice(rowPosition - 1, 1);
  }
  public getProtect(): any {
    return {
      setDescription: () => {},
      setWarningOnly: () => {}
    };
  }
}

class MockSpreadsheet {
  private sheets: MockSheet[] = [];
  constructor() {
    this.sheets.push(new MockSheet('Sheet1'));
  }
  public getSheetByName(name: string): any {
    return this.sheets.find(s => s.name === name) || null;
  }
  public getSheets(): any[] { return this.sheets; }
  public insertSheet(name: string): any {
    const s = new MockSheet(name);
    this.sheets.push(s);
    return s;
  }
  public deleteSheet(sheet: any): void {
    this.sheets = this.sheets.filter(s => s.name !== sheet.getName());
  }
  public getId(): string { return 'mock_spreadsheet_id'; }
  public getUrl(): string { return 'https://docs.google.com/spreadsheets/d/mock'; }
}

export function setupGlobalMocks(): void {
  const g = globalThis as any;
  const buf = g.Buffer;

  g.CacheService = {
    getScriptCache: () => new MockCache(),
    getDocumentCache: () => new MockCache(),
    getUserCache: () => new MockCache()
  };

  g.PropertiesService = {
    getScriptProperties: () => new MockProperties(),
    getDocumentProperties: () => new MockProperties(),
    getUserProperties: () => new MockProperties()
  };

  g.SpreadsheetApp = {
    openById: (_id: string) => new MockSpreadsheet(),
    getActiveSpreadsheet: () => new MockSpreadsheet(),
    flush: () => {}
  };

  g.LockService = {
    getScriptLock: () => ({
      tryLock: () => true,
      releaseLock: () => {}
    })
  };

  g.UrlFetchApp = {
    fetch: (url: string) => ({
      getResponseCode: () => 200,
      getContentText: () => {
        if (url.includes('tokeninfo')) {
          return JSON.stringify({
            sub: 'mock_firebase_user_123',
            email: 'test@example.com'
          });
        }
        // Blogger post HTML mock containing JSON-LD Product
        return `
          <html>
            <body>
              <script type="application/ld+json">
                {
                  "@context": "https://schema.org",
                  "@type": "Product",
                  "name": "Mock Premium Product",
                  "sku": "premium_123",
                  "url": "https://blog.example.com/premium-product",
                  "offers": {
                    "@type": "Offer",
                    "price": "999",
                    "priceCurrency": "INR",
                    "availability": "https://schema.org/InStock",
                    "eligibleQuantity": {
                      "@type": "QuantitativeValue",
                      "minValue": 1,
                      "maxValue": 5
                    }
                  },
                  "addOn": [
                    {
                      "@type": "Offer",
                      "name": "Luxury Gift Wrap",
                      "price": "50",
                      "priceCurrency": "INR",
                      "availability": "https://schema.org/InStock",
                      "eligibleQuantity": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 3
                      }
                    }
                  ]
                }
              </script>
            </body>
          </html>
        `;
      }
    })
  };

  g.ContentService = {
    createTextOutput: (text: string) => {
      let mime: any = null;
      return {
        setMimeType: (m: any) => { mime = m; },
        getContent: () => text,
        getMimeType: () => mime
      };
    },
    MimeType: {
      JSON: 'JSON',
      TEXT: 'TEXT'
    }
  };

  g.HtmlService = {
    createHtmlOutput: (html: string) => ({
      getContent: () => html
    })
  };

  g.Session = {
    getActiveUser: () => ({
      getEmail: () => 'admin@example.com'
    })
  };

  g.GmailApp = {
    sendEmail: () => {}
  };

  g.DriveApp = {
    getFileById: () => ({
      makeCopy: () => ({
        getName: () => 'BackupCopy',
        getId: () => 'backup_id'
      })
    })
  };

  g.Utilities = {
    computeDigest: () => [1, 2, 3],
    computeHmacSha256Signature: () => [4, 5, 6],
    computeRsaSha256Signature: () => [7, 8, 9],
    base64Decode: (str: string) => {
      const b = buf.from(str, 'base64');
      return Array.from(b);
    },
    base64DecodeWebSafe: (str: string) => {
      const normalized = str.replace(/-/g, '+').replace(/_/g, '/');
      const b = buf.from(normalized, 'base64');
      return Array.from(b);
    },
    base64EncodeWebSafe: (data: any) => {
      const str = typeof data === 'string' ? data : buf.from(data).toString('base64');
      return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    },
    base64Encode: (data: any) => {
      return typeof data === 'string' ? buf.from(data).toString('base64') : buf.from(data).toString('base64');
    },
    getUuid: () => 'mock_uuid_12345678',
    sleep: () => {},
    newBlob: (data: any) => {
      const bytes = Array.isArray(data) ? data : Array.from(buf.from(String(data)));
      return {
        getDataAsString: () => buf.from(bytes).toString('utf8')
      };
    },
    Charset: {
      UTF_8: 'UTF_8'
    },
    DigestAlgorithm: {
      SHA_256: 'SHA_256'
    }
  };

  g.ScriptApp = {
    getProjectTriggers: () => [],
    deleteTrigger: () => {},
    newTrigger: () => ({
      timeBased: () => ({
        everyMinutes: () => ({ create: () => {} }),
        everyHours: () => ({ create: () => {} }),
        everyDays: () => ({ atHour: () => ({ create: () => {} }) }),
        everyWeeks: () => ({ onWeekDay: () => ({ atHour: () => ({ create: () => {} }) }) }),
        onMonthDay: () => ({ atHour: () => ({ create: () => {} }) })
      })
    }),
    WeekDay: {
      MONDAY: 'MONDAY'
    }
  };
}
