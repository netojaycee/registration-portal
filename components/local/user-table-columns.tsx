import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export type UserRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  branch: string;
  gender: string;
  isAccredited: boolean;
  membershipStatus: "member" | "visitor";
};

export function getUserColumns(
  selected: string[],
  onSelect: (id: string, checked: boolean) => void,
  onSelectAll: (checked: boolean) => void,
  onAccredit: (id: string) => void
): ColumnDef<UserRow>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={checked => onSelectAll(!!checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selected.includes(row.original.id)}
          onCheckedChange={checked => onSelect(row.original.id, !!checked)}
          aria-label={`Select user ${row.original.firstName} ${row.original.lastName}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "branch",
      header: "Branch",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "membershipStatus",
      header: "Member Type",
      cell: ({ row }) => (
        <span className={row.original.membershipStatus === "member" ? "text-blue-700" : "text-pink-700"}>
          {row.original.membershipStatus.charAt(0).toUpperCase() + row.original.membershipStatus.slice(1)}
        </span>
      ),
    },
    {
      accessorKey: "isAccredited",
      header: "Accredited",
      cell: ({ row }) =>
        row.original.isAccredited ? (
          <span className="text-green-600 font-semibold">Yes</span>
        ) : (
          <span className="text-red-500 font-semibold">No</span>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) =>
        !row.original.isAccredited ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAccredit(row.original.id)}
          >
            Accredit
          </Button>
        ) : null,
    },
  ];
}
