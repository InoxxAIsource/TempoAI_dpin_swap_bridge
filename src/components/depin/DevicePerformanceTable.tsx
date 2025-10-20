import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Download } from 'lucide-react';
import { useState } from 'react';

interface Device {
  id: string;
  device_name: string;
  device_type: string;
  status: string;
  last_seen_at: string;
  metadata: any;
}

interface DevicePerformanceTableProps {
  devices: Device[];
}

const DevicePerformanceTable = ({ devices }: DevicePerformanceTableProps) => {
  const [sortField, setSortField] = useState<'name' | 'earnings' | 'uptime'>('earnings');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'name' | 'earnings' | 'uptime') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedDevices = [...devices].sort((a, b) => {
    let aVal, bVal;
    
    switch (sortField) {
      case 'name':
        aVal = a.device_name;
        bVal = b.device_name;
        break;
      case 'earnings':
        aVal = a.metadata?.dailyEarnings || 0;
        bVal = b.metadata?.dailyEarnings || 0;
        break;
      case 'uptime':
        aVal = 95; // Mock uptime
        bVal = 95;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const exportToCSV = () => {
    const headers = ['Device Name', 'Type', 'Daily Earnings', 'Uptime', 'Status', 'Last Active'];
    const rows = sortedDevices.map(device => [
      device.device_name,
      device.device_type,
      `$${(device.metadata?.dailyEarnings || 0).toFixed(2)}`,
      '95%',
      device.status,
      new Date(device.last_seen_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'device-performance.csv';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Device Performance</h3>
        <Button variant="outline" size="sm" onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('name')}>
                  Device Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('earnings')}>
                  Daily Earnings
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('uptime')}>
                  Uptime
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDevices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.device_name}</TableCell>
                <TableCell className="capitalize">{device.device_type.replace('-', ' ')}</TableCell>
                <TableCell>${(device.metadata?.dailyEarnings || 0).toFixed(2)}</TableCell>
                <TableCell>95%</TableCell>
                <TableCell>
                  <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                    {device.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(device.last_seen_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DevicePerformanceTable;
