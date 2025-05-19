import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, FileText, Download } from "lucide-react"
import Link from "next/link"

export default function RecordsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Medical Records</h1>
            <p className="text-muted-foreground">View and manage patient medical records</p>
          </div>
          <Button asChild>
            <Link href="/records/new">
              <Plus className="mr-2 h-4 w-4" />
              New Record
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search records by patient name, ID, or diagnosis..."
              className="pl-8 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Record Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="lab">Lab Results</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">R78901</TableCell>
                <TableCell>Emma Wilson (P12345)</TableCell>
                <TableCell>Consultation</TableCell>
                <TableCell>May 10, 2023</TableCell>
                <TableCell>Dr. Smith</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Complete
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/records/R78901">
                        <FileText className="mr-1 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">R78902</TableCell>
                <TableCell>James Brown (P12346)</TableCell>
                <TableCell>Lab Results</TableCell>
                <TableCell>May 11, 2023</TableCell>
                <TableCell>Dr. Johnson</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Pending Review
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/records/R78902">
                        <FileText className="mr-1 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">R78903</TableCell>
                <TableCell>Sophia Martinez (P12347)</TableCell>
                <TableCell>Imaging</TableCell>
                <TableCell>May 12, 2023</TableCell>
                <TableCell>Dr. Williams</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Complete
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/records/R78903">
                        <FileText className="mr-1 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">R78904</TableCell>
                <TableCell>Michael Johnson (P12348)</TableCell>
                <TableCell>Prescription</TableCell>
                <TableCell>May 13, 2023</TableCell>
                <TableCell>Dr. Smith</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Complete
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/records/R78904">
                        <FileText className="mr-1 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">R78905</TableCell>
                <TableCell>Olivia Davis (P12349)</TableCell>
                <TableCell>Consultation</TableCell>
                <TableCell>May 14, 2023</TableCell>
                <TableCell>Dr. Johnson</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Incomplete
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/records/R78905">
                        <FileText className="mr-1 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  )
}
