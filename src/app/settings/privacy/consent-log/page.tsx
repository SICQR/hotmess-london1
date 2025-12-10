'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ArrowLeft, Download, Shield, Filter, Clock, MapPin, Cookie, Mail, Activity } from 'lucide-react';

interface ConsentLog {
  id: string;
  category: string; // Changed from consent_type to match new enum
  action: string; // Changed from consent_action to match new enum
  metadata: any; // Changed from consent_value to metadata
  occurred_at: string; // Changed from created_at
}

export default function ConsentLogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ConsentLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ConsentLog[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  useEffect(() => {
    loadConsentLogs();
  }, []);

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => log.category === filterType));
    }
  }, [filterType, logs]);

  async function loadConsentLogs(loadMore = false) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Use NEW RPC with pagination
      const { data, error } = await supabase.rpc('get_my_consent_history', {
        p_limit: 50,
        p_cursor: loadMore ? cursor : null,
        p_category: null, // null = all categories
      });

      if (error) throw error;

      const newLogs = data || [];
      
      if (loadMore) {
        setLogs([...logs, ...newLogs]);
        setFilteredLogs([...filteredLogs, ...newLogs]);
      } else {
        setLogs(newLogs);
        setFilteredLogs(newLogs);
      }

      // Check if there are more logs
      setHasMore(newLogs.length === 50);
      
      // Set cursor to last item's occurred_at for next page
      if (newLogs.length > 0) {
        setCursor(newLogs[newLogs.length - 1].occurred_at);
      }
    } catch (error: any) {
      console.error('Load consent logs error:', error);
      toast.error('Failed to load consent logs');
    } finally {
      setLoading(false);
    }
  }

  async function exportLogs() {
    try {
      const exportData = {
        export_date: new Date().toISOString(),
        consent_logs: filteredLogs.map(log => ({
          type: log.category,
          action: log.action,
          value: log.metadata,
          timestamp: log.occurred_at,
        })),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hotmess-consent-log-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Consent log exported');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export logs');
    }
  }

  function getConsentTypeIcon(type: string) {
    switch (type) {
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'cookies':
        return <Cookie className="w-4 h-4" />;
      case 'marketing':
        return <Mail className="w-4 h-4" />;
      case 'analytics':
        return <Activity className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  }

  function getActionColor(action: string) {
    switch (action) {
      case 'granted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'denied':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'revoked':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'updated':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-white/10 text-white/60 border-white/20';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading consent logs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/settings')}
            className="mb-4 text-white/60 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="uppercase tracking-tight mb-2" style={{ fontWeight: 900, fontSize: '2.25rem' }}>
                CONSENT LOG
              </h1>
              <p className="text-white/60" style={{ fontWeight: 400, fontSize: '1rem' }}>
                Complete history of your privacy consent choices
              </p>
            </div>
            <Button
              onClick={exportLogs}
              className="bg-[#FF0080] hover:bg-[#FF0080]/80 uppercase tracking-tight"
              style={{ fontWeight: 800 }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* GDPR Notice */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white/80" style={{ fontWeight: 400 }}>
                <strong style={{ fontWeight: 700 }}>Your Right to Access:</strong> Under GDPR Article 15, you have the right to access all consent records. This log shows every consent action you've taken, including when and how you granted or revoked permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-white/40" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="cookies">Cookies</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-white/60">
                Showing {filteredLogs.length} of {logs.length} records
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Consent Logs */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FF0080]" />
              Consent History
            </CardTitle>
            <CardDescription className="text-white/60">
              Chronological record of all consent actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-40" />
                <p style={{ fontWeight: 400 }}>No consent logs found</p>
                <p className="text-sm mt-2" style={{ fontWeight: 400 }}>
                  {filterType === 'all' 
                    ? 'Your consent actions will appear here' 
                    : 'No logs for this consent type'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log, index) => (
                  <div key={log.id}>
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[#FF0080]">
                        {getConsentTypeIcon(log.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="uppercase tracking-tight" style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                            {log.category}
                          </span>
                          <Badge className={`uppercase text-xs ${getActionColor(log.action)}`}>
                            {log.action}
                          </Badge>
                        </div>

                        {/* Consent Value */}
                        {log.metadata && (
                          <div className="text-sm text-white/70 mb-2" style={{ fontWeight: 400 }}>
                            {log.category === 'location' && log.metadata.mode && (
                              <span>Mode: <strong className="text-white">{log.metadata.mode.toUpperCase()}</strong></span>
                            )}
                            {log.metadata.previous_mode && (
                              <span className="ml-2 text-white/50">
                                (was: {log.metadata.previous_mode})
                              </span>
                            )}
                            {log.metadata.reason && (
                              <span className="ml-2 text-white/50">
                                Reason: {log.metadata.reason}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Timestamp & Metadata */}
                        <div className="flex items-center gap-4 text-xs text-white/50" style={{ fontWeight: 400 }}>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(log.occurred_at).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {log.metadata.user_agent && (
                            <span className="truncate max-w-xs" title={log.metadata.user_agent}>
                              {log.metadata.user_agent.includes('Mobile') ? '📱 Mobile' : '💻 Desktop'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {index < filteredLogs.length - 1 && (
                      <Separator className="bg-white/10 my-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Load More Button */}
        {hasMore && logs.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => loadConsentLogs(true)}
              variant="outline"
              className="border-white/20 uppercase tracking-tight"
              style={{ fontWeight: 800 }}
            >
              Load More
            </Button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>
              <strong className="text-white" style={{ fontWeight: 700 }}>Data Retention:</strong> Consent logs are kept for 7 years to comply with GDPR Article 30 (record-keeping requirements). You can export this data at any time using the Export button above.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}