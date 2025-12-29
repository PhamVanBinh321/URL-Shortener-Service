import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface EditLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, tags: string) => void;
    linkData: {
        shortUrl: string;
        destinationUrl: string;
        title: string;
        tags: string;
    };
}

export function EditLinkModal({ isOpen, onClose, onSave, linkData }: EditLinkModalProps) {
    const [title, setTitle] = useState(linkData.title);
    const [tags, setTags] = useState(linkData.tags);
    const [copiedShort, setCopiedShort] = useState(false);
    const [copiedDest, setCopiedDest] = useState(false);

    const handleCopy = (text: string, type: 'short' | 'dest') => {
        navigator.clipboard.writeText(text);
        if (type === 'short') {
            setCopiedShort(true);
            setTimeout(() => setCopiedShort(false), 2000);
        } else {
            setCopiedDest(true);
            setTimeout(() => setCopiedDest(false), 2000);
        }
    };

    const handleSave = () => {
        onSave(title, tags);
        onClose();
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
                    <h2 className="text-2xl font-bold text-gray-900">Edit link</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Link Details (Read-only) */}
                <div className="space-y-6 mb-6">
                    {/* Short Link (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Short link
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                value={linkData.shortUrl}
                                readOnly
                                className="h-12 border-gray-300 bg-gray-50 pr-10 text-gray-600 cursor-not-allowed"
                            />
                            <button
                                onClick={() => handleCopy(linkData.shortUrl, 'short')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded transition-colors"
                                title="Copy short link"
                            >
                                {copiedShort ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Copy className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Destination URL (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Destination URL
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                value={linkData.destinationUrl}
                                readOnly
                                className="h-12 border-gray-300 bg-gray-50 pr-10 text-gray-600 cursor-not-allowed"
                            />
                            <button
                                onClick={() => handleCopy(linkData.destinationUrl, 'dest')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded transition-colors"
                                title="Copy destination URL"
                            >
                                {copiedDest ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Copy className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-gray-200"></div>

                    {/* Title (Editable) */}
                    <div>
                        <label htmlFor="editTitle" className="block text-sm font-medium text-gray-900 mb-2">
                            Title
                        </label>
                        <Input
                            id="editTitle"
                            type="text"
                            placeholder="Enter a title for your link"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-12 border-gray-300"
                        />
                    </div>

                    {/* Tags (Editable) */}
                    <div>
                        <label htmlFor="editTags" className="block text-sm font-medium text-gray-900 mb-2">
                            Tags
                        </label>
                        <Input
                            id="editTags"
                            type="text"
                            placeholder="e.g., marketing, social, campaign"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="h-12 border-gray-300"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-11 px-6 border-gray-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Save changes
                    </Button>
                </div>
            </div>
        </>
    );
}
