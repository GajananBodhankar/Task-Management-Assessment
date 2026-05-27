import { LogOut } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type AlertConfirmProps = {
  onConfirm: () => void
}

function AlertConfirm({ onConfirm }: AlertConfirmProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="logout-button" type="button">
          <LogOut size={18} />
          Logout
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>You will be signed out of TaskFlow on this device.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant={undefined} size={undefined}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant={undefined} size={undefined}>
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertConfirm
