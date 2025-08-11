"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuthStore } from "@/lib/stores/authStore"
import { Download } from 'lucide-react'
import QRCode from "react-qr-code"

export default function ShowQRCodeModal({
    qrCodeUrl,
    opened,
    setOpened
}: {
    qrCodeUrl: string,
    opened: boolean,
    setOpened: (opened: boolean) => void
}) {
    const { user } = useAuthStore()

    const downloadQRCode = () => {
        const svg = document.getElementById('qr-code')
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg)
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            img.onload = () => {
                const qrSize = 1024
                const padding = 50
                const canvasSize = qrSize + padding * 2
                canvas.width = canvasSize
                canvas.height = canvasSize
                if (ctx) {
                    ctx.fillStyle = '#FFFFFF'
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                    ctx.drawImage(img, padding, padding, qrSize, qrSize)
                }

                const pngFile = canvas.toDataURL('image/png')
                const downloadLink = document.createElement('a')
                downloadLink.download = `${user?.id}-qr-code.png`
                downloadLink.href = pngFile
                downloadLink.click()
            }

            img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
        }
    }
    return (

        <Dialog open={opened} onOpenChange={setOpened}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Digital Membership QR Code</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                        <QRCode
                            value={qrCodeUrl}
                            size={200}
                            level="M"
                        />
                    </div>
                    <p className="text-center text-sm text-gray-600">
                        Present this code at the gym for entry
                    </p>
                    <Button onClick={downloadQRCode} variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
