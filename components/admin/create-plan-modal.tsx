"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { PlansService, type CreatePlanData } from "@/lib/services/plans.service"
import { usePlanStore } from "@/lib/stores/planStore"
import { PlanInterval } from "@prisma/client"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface CreatePlanModalProps {
    onActionComplete?: () => void
}

export default function CreatePlanModal({ onActionComplete }: CreatePlanModalProps) {
    const { isCreateModalOpen, setIsCreateModalOpen } = usePlanStore()
    const { toast } = useToast()

    const [formData, setFormData] = useState<CreatePlanData>({
        name: "",
        description: "",
        price: 0,
        interval: PlanInterval.monthly,
        features: [""],
        status: "active",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: 0,
            interval: PlanInterval.monthly,
            features: [""],
            status: "active",
        })
    }

    const handleCreatePlan = async () => {
        try {
            setIsSubmitting(true)

            // Filter out empty features
            const cleanedFormData = {
                ...formData,
                features: formData.features.filter(feature => feature.trim() !== "")
            }

            if (!cleanedFormData.name.trim()) {
                toast({
                    title: "Error",
                    description: "Plan name is required",
                    variant: "destructive",
                })
                return
            }

            if (cleanedFormData.price <= 0) {
                toast({
                    title: "Error",
                    description: "Price must be greater than 0",
                    variant: "destructive",
                })
                return
            }

            const response = await PlansService.create(cleanedFormData)
            if (response.success) {
                toast({
                    title: "Success",
                    description: "Plan created successfully",
                })
                setIsCreateModalOpen(false)
                resetForm()
                onActionComplete?.()
            } else {
                throw new Error(response.message || "Failed to create plan")
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create plan",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const addFeature = () => {
        setFormData((prev) => ({
            ...prev,
            features: [...prev.features, ""],
        }))
    }

    const removeFeature = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }))
    }

    const updateFeature = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.map((feature, i) => (i === index ? value : feature)),
        }))
    }

    const handleClose = () => {
        if (!isSubmitting) {
            setIsCreateModalOpen(false)
            resetForm()
        }
    }

    return (
        <Dialog open={isCreateModalOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Plan</DialogTitle>
                    <DialogDescription>Add a new membership plan to your gym</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="name">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            className="col-span-3"
                            placeholder="e.g., Premium Monthly"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label htmlFor="description">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            className="col-span-3"
                            placeholder="Describe the plan benefits..."
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label htmlFor="price">
                            Price (₦)
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                            className="col-span-3"
                            placeholder="25000"
                            min="1"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label htmlFor="interval">
                            Interval
                        </Label>
                        <Select
                            value={formData.interval}
                            onValueChange={(value: "monthly" | "annual") => setFormData((prev) => ({ ...prev, interval: value }))}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="annual">Annual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label>Features</Label>
                        <div className="col-span-3 space-y-2">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={feature}
                                        onChange={(e) => updateFeature(index, e.target.value)}
                                        placeholder="Enter feature..."
                                        disabled={isSubmitting}
                                    />
                                    {formData.features.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeFeature(index)}
                                            disabled={isSubmitting}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addFeature}
                                className="w-full bg-transparent"
                                disabled={isSubmitting}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Feature
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label htmlFor="status">
                            Status
                        </Label>
                        <div className="col-span-3 flex items-center space-x-2">
                            <Switch
                                id="status"
                                checked={formData.status === "active"}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
                                }
                                disabled={isSubmitting}
                            />
                            <Label htmlFor="status">{formData.status === "active" ? "Active" : "Inactive"}</Label>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreatePlan} disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Plan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}