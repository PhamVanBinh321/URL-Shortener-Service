import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CreateLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateLink: (url: string, customSlug: string, title: string) => void;
}

export function CreateLinkModal({ isOpen, onClose, onCreateLink }: CreateLinkModalProps) {
    const [destinationUrl, setDestinationUrl] = useState("");
    const [domain, setDomain] = useState("bit.ly");
    const [customSlug, setCustomSlug] = useState("");
    const [title, setTitle] = useState("");

    const handleCreate = () => {
        if (destinationUrl) {
            onCreateLink(destinationUrl, customSlug, title);
            // Reset form
            setDestinationUrl("");
            setCustomSlug("");
            setTitle("");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 p-6 sm:p-8 max-h-[90vh] overflow-y-auto mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Create a new link</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Link Details Section */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Link details</h3>
                        </div>

                        <p className="text-sm text-gray-600 mb-6">
                            You have 4 links and 3 custom back-halves remaining this month.{" "}
                            <a href="#" className="text-blue-600 hover:underline">Upgrade for more</a>.
                        </p>

                        {/* Destination URL */}
                        <div className="mb-6">
                            <label htmlFor="destinationUrl" className="block text-sm font-medium text-gray-900 mb-2">
                                Destination URL
                            </label>
                            <Input
                                id="destinationUrl"
                                type="url"
                                placeholder="https://example.com/my-long-url"
                                value={destinationUrl}
                                onChange={(e) => setDestinationUrl(e.target.value)}
                                className="h-12 border-gray-300"
                            />
                        </div>

                        {/* Short link */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Short link
                            </label>
                            <div className="flex items-center gap-2">
                                <Select value={domain} onValueChange={setDomain}>
                                    <SelectTrigger className="w-40 h-12 border-gray-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bit.ly">bit.ly</SelectItem>
                                        <SelectItem value="short.link">short.link</SelectItem>
                                        <SelectItem value="tiny.url">tiny.url</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="text-gray-500 text-xl">/</span>
                                <Input
                                    type="text"
                                    placeholder="custom-back-half"
                                    value={customSlug}
                                    onChange={(e) => setCustomSlug(e.target.value)}
                                    className="flex-1 h-12 border-gray-300"
                                />
                            </div>
                        </div>

                        {/* Title (optional) */}
                        <div className="mb-6">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                                Title <span className="text-gray-500 font-normal">(optional)</span>
                            </label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Enter a title for your link"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-12 border-gray-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-11 px-6 border-gray-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!destinationUrl}
                        className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create
                    </Button>
                </div>
            </div>
        </>
    );
}
