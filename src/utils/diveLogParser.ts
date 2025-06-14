
export interface DiveDataPoint {
  timestamp: string;
  depth: number;
}

export interface ParsedDiveLog {
  profile: DiveDataPoint[];
  maxDepth: number;
  diveTimeInSeconds: number;
}

// Analizador básico de CSV que asume el formato: timestamp,profundidad
const parseCsv = (csvContent: string): ParsedDiveLog => {
    const lines = csvContent.trim().split('\n');
    const headerLine = lines.shift()?.trim().toLowerCase();
    
    if (!headerLine) {
        throw new Error('El archivo CSV está vacío o tiene un formato incorrecto.');
    }
    const header = headerLine.split(',');

    const timestampIndex = header.indexOf('timestamp');
    const depthIndex = header.indexOf('profundidad');

    if (timestampIndex === -1 || depthIndex === -1) {
        throw new Error('CSV inválido. Debe contener las columnas "timestamp" y "profundidad".');
    }

    const profile: DiveDataPoint[] = lines.map(line => {
        const values = line.trim().split(',');
        const depth = parseFloat(values[depthIndex]);
        if (isNaN(depth) || !values[timestampIndex]) {
            return null;
        }
        return {
            timestamp: new Date(values[timestampIndex]).toISOString(),
            depth: depth,
        };
    }).filter((p): p is DiveDataPoint => p !== null && !isNaN(p.depth));

    if (profile.length === 0) {
        return { profile: [], maxDepth: 0, diveTimeInSeconds: 0 };
    }

    const maxDepth = Math.max(...profile.map(p => p.depth));
    const startTime = new Date(profile[0].timestamp).getTime();
    const endTime = new Date(profile[profile.length - 1].timestamp).getTime();
    const diveTimeInSeconds = (endTime - startTime) / 1000;

    return { profile, maxDepth, diveTimeInSeconds };
}

export const parseDiveLog = (fileContent: string, fileType: string): ParsedDiveLog => {
    if (fileType.includes('csv')) {
        return parseCsv(fileContent);
    }
    // Aquí se pueden agregar más analizadores para XML, UDDF, etc.
    throw new Error(`Formato de archivo no soportado: ${fileType}`);
}
