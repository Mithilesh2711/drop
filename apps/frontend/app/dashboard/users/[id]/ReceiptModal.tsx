import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}

export default function ReceiptModal({ isOpen, onClose, transaction }: ReceiptModalProps) {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">Receipt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold">Payment Receipt</h2>
            <p className="text-gray-600">Date: {new Date(transaction.date).toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Customer ID:</p>
              <p>{transaction.customerId}</p>
            </div>
            <div>
              <p className="font-semibold">Customer Name:</p>
              <p>{transaction.name}</p>
            </div>
            <div>
              <p className="font-semibold">Mobile:</p>
              <p>{transaction.mobile}</p>
            </div>
            <div>
              <p className="font-semibold">Email:</p>
              <p>{transaction.email || 'N/A'}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 mt-4">
            <h3 className="font-semibold mb-2">Payment Details</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Plan:</p>
                  <p>{transaction.planName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Mode:</p>
                  <p>{transaction.paymentDetails.paymentMode}</p>
                </div>
                {transaction.paymentDetails.refNo && (
                  <div>
                    <p className="text-gray-600">Reference No:</p>
                    <p>{transaction.paymentDetails.refNo}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Receipt Items</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transaction.receipt.map((item: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.headName}</td>
                    <td className="text-right py-2">₹{item.headAmount}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-2">Total Amount</td>
                  <td className="text-right py-2">₹{transaction.totalPaidAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => window.open(`/receipt?id=${transaction._id}`, '_blank')}
            >
              Print Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
