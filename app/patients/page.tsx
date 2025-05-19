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
import { Search, Plus, Filter } from "lucide-react"
import Link from "next/link"

export default function PatientsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
            <p className="text-muted-foreground">Manage and view patient records</p>
          </div>
          <Button asChild>
            <Link href="/patients/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search patients by name, ID, or condition..." className="pl-8 w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">P12345</TableCell>
                <TableCell>Emma Wilson</TableCell>
                <TableCell>42</TableCell>
                <TableCell>Female</TableCell>
                <TableCell>+1 (555) 123-4567</TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell>May 10, 2023</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/patients/P12345">View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/appointments/new?patient=P12345">Schedule</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">P12346</TableCell>
                <TableCell>James Brown</TableCell>
                <TableCell>35</TableCell>
                <TableCell>Male</TableCell>
                <TableCell>+1 (555) 234-5678</TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell>May 11, 2023</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/patients/P12346">View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/appointments/new?patient=P12346">Schedule</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">P12347</TableCell>
                <TableCell>Sophia Martinez</TableCell>
                <TableCell>28</TableCell>
                <TableCell>Female</TableCell>
                <TableCell>+1 (555) 345-6789</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    Critical
                  </Badge>
                </TableCell>
                <TableCell>May 12, 2023</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/patients/P12347">View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/appointments/new?patient=P12347">Schedule</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">P12348</TableCell>
                <TableCell>Michael Johnson</TableCell>
                <TableCell>56</TableCell>
                <TableCell>Male</TableCell>
                <TableCell>+1 (555) 456-7890</TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell>May 13, 2023</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/patients/P12348">View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/appointments/new?patient=P12348">Schedule</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">P12349</TableCell>
                <TableCell>Olivia Davis</TableCell>
                <TableCell>19</TableCell>
                <TableCell>Female</TableCell>
                <TableCell>+1 (555) 567-8901</TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell>May 14, 2023</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/patients/P12349">View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/appointments/new?patient=P12349">Schedule</Link>
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
