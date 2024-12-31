'use client';

import { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEventStore } from '@/lib/store/event-store';

export default function EventResults() {
  const { eventId } = useParams();

  const { currentEvent, loading, error, fetchEvent } = useEventStore();

  useEffect(() => {
    fetchEvent(eventId as string);
  }, [eventId, fetchEvent]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Loading results...</p>
      </div>
    );
  }

  if (error || !currentEvent) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Error loading event results</p>
        <p>{JSON.stringify(error)}</p>
      </div>
    );
  }

  // const sortedTeams = [] // [...currentEvent.teams].sort((a, b) => b.total_score - a.total_score);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">{currentEvent.name} - Results</h1>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {sortedTeams.map((team, index) => (
                <TableRow key={team.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{team.name}</TableCell>
                  <TableCell className="text-right">{team.total_score}</TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
