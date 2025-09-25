"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMembers } from "@/hooks/shared";
import { LoadingComponent } from "@/components/shared";

export default function Root() {
  const { data, isLoading } = useGetMembers();
  const members = data?.data ?? [];

  return (
    <section className='w-full bg-white font-inter'>
      <header className='flex flex-row items-center w-full justify-between px-[20px] py-6'>
        <h2 className='section-header'>All Members</h2>
        <Button size='sm' className='w-fit px-4 rounded-[8px]'>
          Download
        </Button>
      </header>
      
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          {members.length === 0 ? (
            <div className="h-full bg-white w-full grid place-items-center py-10">
              <div className="flex flex-col items-center gap-4">
                <img src="/members.svg" alt="Members Icon" width={100} height={100} />
                <p className="text-[13px] max-w-[415px] mx-auto text-center leading-[20px] text-[#5B5971]">
                  No members found. Members who book classes will appear here.
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader className='bg-[#F6F6F6]'>
                <TableRow>
                  <TableHead className='text-center'>Full Name</TableHead>
                  <TableHead className='text-center'>Email Address</TableHead>
                  <TableHead className='text-center'>Total Bookings</TableHead>
                  <TableHead className='text-center'>Attended Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow className='text-[#686868]' key={member.userId || index}>
                    <TableCell className='text-center'>{member.fullname}</TableCell>
                    <TableCell className='underline text-center text-[#1D71D4]'>
                      {member.email}
                    </TableCell>
                    <TableCell className='text-center'>
                      {member.totalBookings}
                    </TableCell>
                    <TableCell className='text-center'>{member.attendedCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </section>
  );
}
