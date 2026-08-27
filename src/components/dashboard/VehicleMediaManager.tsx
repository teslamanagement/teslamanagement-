import React, { useState, useRef } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  RefreshCw,
  Palette,
  Image as ImageIcon,
  Check,
  Link as LinkIcon,
  X,
  Sparkles,
  Info,
  Loader2,
  AlertCircle,
  HardDrive,
} from 'lucide-react';
import { Vehicle, VehicleColor } from '../../types';
import { TESLA_COLOR_PRESETS } from '../../data/colors';
import { storageService } from '../../services/storage';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import { resolveAssetUrl } from '../../utils/resolveAsset';

interface VehicleMediaManagerProps {
  vehicle: Vehicle;
  onChange: (updatedVehicle: Vehicle) => void;
}

export const VehicleMediaManager: React.FC<VehicleMediaManagerProps> = ({
  vehicle,
  onChange,
}) => {
  const [activeColorId, setActiveColorId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#E82127');
  const [showAddCustomColor, setShowAddCustomColor] = useState(false);

  // Uploading and feedback states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Replacement dialog states
  const [replacingGeneralIndex, setReplacingGeneralIndex] = useState<number | null>(null);
  const [replaceUrlInput, setReplaceUrlInput] = useState('');
  const [replacingColorIndex, setReplacingColorIndex] = useState<number | null>(null);
  const [replaceColorUrlInput, setReplaceColorUrlInput] = useState('');

  // Drag over states
  const [isGeneralDragOver, setIsGeneralDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const colorFileInputRef = useRef<HTMLInputElement>(null);
  const replaceColorFileInputRef = useRef<HTMLInputElement>(null);

  // Compute clean general images array without any forced or hardcoded restoration
  const generalImages: string[] = Array.isArray(vehicle.galleryImages)
    ? vehicle.galleryImages
    : (vehicle.imageUrl ? [vehicle.imageUrl] : []);

  const vehicleColors: VehicleColor[] = vehicle.colors || [];

  // Helper to convert File to Base64
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload helper: converts file to web-optimized data and uploads to persistent server URL
  const uploadAndGetPersistentUrl = async (file: File, _prefix = 'car'): Promise<string> => {
    let dataUrl: string;
    try {
      // Compress and scale to max 1920x1080 WebP/JPEG
      dataUrl = await optimizeImageFile(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
    } catch {
      dataUrl = await readFileAsDataUrl(file);
    }

    const res = await storageService.uploadImage(dataUrl, vehicle.id || 'catalog', file.name);
    if (res.success && res.url) {
      return res.url;
    }
    return dataUrl;
  };

  // ----------------------------------------------------
  // GENERAL IMAGES HANDLERS
  // ----------------------------------------------------
  const saveGeneralImages = (newImages: string[]) => {
    // If images exist, the first image is always the default/main imageUrl
    // If all images are deleted, imageUrl is empty string ''
    const primaryImg = newImages.length > 0 ? newImages[0] : '';
    if (primaryImg && vehicle.id) {
      storageService.saveVehicleImage(vehicle.id, primaryImg);
    }
    onChange({
      ...vehicle,
      imageUrl: primaryImg,
      galleryImages: newImages,
    });
  };

  const handleGeneralFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadMessage(`Uploading ${files.length} photo${files.length > 1 ? 's' : ''} to persistent disk storage...`);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (generalImages.length + newUrls.length >= 12) break;
        const persistentUrl = await uploadAndGetPersistentUrl(files[i], `${vehicle.id || 'veh'}-gen-${i}`);
        newUrls.push(persistentUrl);
      }

      const updated = [...generalImages, ...newUrls].slice(0, 12);
      saveGeneralImages(updated);
      setUploadMessage('Photos successfully uploaded and saved to server.');
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGeneralDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsGeneralDragOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadMessage('Uploading dropped photos to persistent storage...');

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          if (generalImages.length + newUrls.length >= 12) break;
          const persistentUrl = await uploadAndGetPersistentUrl(files[i], `${vehicle.id || 'veh'}-drop-${i}`);
          newUrls.push(persistentUrl);
        }
      }

      if (newUrls.length > 0) {
        const updated = [...generalImages, ...newUrls].slice(0, 12);
        saveGeneralImages(updated);
        setUploadMessage('Dropped photos saved to server storage.');
        setTimeout(() => setUploadMessage(null), 3000);
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to process dropped photos');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddGeneralUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (generalImages.length >= 12) return;

    const updated = [...generalImages, trimmed].slice(0, 12);
    saveGeneralImages(updated);
    setUrlInput('');
    setShowUrlInput(false);
  };

  // Replace specific general image with a file
  const handleReplaceGeneralFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replacingGeneralIndex === null) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadMessage('Replacing and saving photo on server disk...');

    try {
      const persistentUrl = await uploadAndGetPersistentUrl(files[0], `${vehicle.id || 'veh'}-repl-${replacingGeneralIndex}`);
      const updated = [...generalImages];
      updated[replacingGeneralIndex] = persistentUrl;
      setReplacingGeneralIndex(null);
      saveGeneralImages(updated);
      setUploadMessage('Photo replaced and saved.');
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to replace photo');
    } finally {
      setIsUploading(false);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    }
  };

  // Replace specific general image with a URL
  const handleReplaceGeneralUrl = () => {
    if (replacingGeneralIndex === null) return;
    const trimmed = replaceUrlInput.trim();
    if (!trimmed) return;

    const updated = [...generalImages];
    updated[replacingGeneralIndex] = trimmed;
    setReplacingGeneralIndex(null);
    setReplaceUrlInput('');
    saveGeneralImages(updated);
  };

  // Set any image as the primary default image (moves to index 0)
  const handleSetPrimary = (index: number) => {
    if (index <= 0 || index >= generalImages.length) return;
    const targetItem = generalImages[index];
    const rest = generalImages.filter((_, i) => i !== index);
    const updated = [targetItem, ...rest];
    saveGeneralImages(updated);
  };

  // Reorder left/right
  const handleMoveGeneralImage = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= generalImages.length) return;
    const updated = [...generalImages];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    saveGeneralImages(updated);
  };

  // Delete any image unconditionally
  const handleDeleteGeneralImage = (index: number) => {
    if (index < 0 || index >= generalImages.length) return;
    const updated = generalImages.filter((_, i) => i !== index);
    if (replacingGeneralIndex === index) {
      setReplacingGeneralIndex(null);
    }
    saveGeneralImages(updated);
  };

  // ----------------------------------------------------
  // COLOR MANAGEMENT HANDLERS
  // ----------------------------------------------------
  const handleAddPresetColor = (preset: { id: string; name: string; hex: string }) => {
    if (vehicleColors.some((c) => c.name.toLowerCase() === preset.name.toLowerCase())) return;
    const newColor: VehicleColor = {
      id: `color-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: preset.name,
      hex: preset.hex,
      images: [],
    };
    const updatedColors = [...vehicleColors, newColor];
    onChange({
      ...vehicle,
      colors: updatedColors,
    });
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    const newColor: VehicleColor = {
      id: `color-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: customColorName.trim(),
      hex: customColorHex,
      images: [],
    };
    const updatedColors = [...vehicleColors, newColor];
    onChange({
      ...vehicle,
      colors: updatedColors,
    });
    setCustomColorName('');
    setShowAddCustomColor(false);
  };

  const handleRemoveColor = (colorId: string) => {
    const updatedColors = vehicleColors.filter((c) => c.id !== colorId);
    if (activeColorId === colorId) setActiveColorId(null);
    onChange({
      ...vehicle,
      colors: updatedColors,
    });
  };

  // ----------------------------------------------------
  // COLOR-SPECIFIC IMAGES HANDLERS
  // ----------------------------------------------------
  const activeColor = vehicleColors.find((c) => c.id === activeColorId);
  const colorImages: string[] = activeColor?.images || [];

  const saveColorImages = (colorId: string, newImages: string[]) => {
    const updatedColors = vehicleColors.map((c) => {
      if (c.id === colorId) {
        return { ...c, images: newImages.slice(0, 10) };
      }
      return c;
    });
    onChange({
      ...vehicle,
      colors: updatedColors,
    });
  };

  const handleColorFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeColorId) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadMessage(`Uploading ${files.length} color photo${files.length > 1 ? 's' : ''}...`);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (colorImages.length + newUrls.length >= 10) break;
        const persistentUrl = await uploadAndGetPersistentUrl(files[i], `${vehicle.id || 'veh'}-color-${activeColorId}-${i}`);
        newUrls.push(persistentUrl);
      }

      const updated = [...colorImages, ...newUrls].slice(0, 10);
      saveColorImages(activeColorId, updated);
      setUploadMessage('Color photos saved to server storage.');
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload color photo');
    } finally {
      setIsUploading(false);
      if (colorFileInputRef.current) colorFileInputRef.current.value = '';
    }
  };

  const handleReplaceColorFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeColorId || replacingColorIndex === null) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadMessage('Replacing color photo on server storage...');

    try {
      const persistentUrl = await uploadAndGetPersistentUrl(files[0], `${vehicle.id || 'veh'}-color-repl-${replacingColorIndex}`);
      const updated = [...colorImages];
      updated[replacingColorIndex] = persistentUrl;
      setReplacingColorIndex(null);
      saveColorImages(activeColorId, updated);
      setUploadMessage('Color photo replaced and saved.');
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to replace color photo');
    } finally {
      setIsUploading(false);
      if (replaceColorFileInputRef.current) replaceColorFileInputRef.current.value = '';
    }
  };

  const handleReplaceColorUrl = () => {
    if (!activeColorId || replacingColorIndex === null) return;
    const trimmed = replaceColorUrlInput.trim();
    if (!trimmed) return;

    const updated = [...colorImages];
    updated[replacingColorIndex] = trimmed;
    setReplacingColorIndex(null);
    setReplaceColorUrlInput('');
    saveColorImages(activeColorId, updated);
  };

  const handleMoveColorImage = (index: number, direction: 'left' | 'right') => {
    if (!activeColorId) return;
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= colorImages.length) return;
    const updated = [...colorImages];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    saveColorImages(activeColorId, updated);
  };

  const handleDeleteColorImage = (index: number) => {
    if (!activeColorId) return;
    const updated = colorImages.filter((_, i) => i !== index);
    if (replacingColorIndex === index) {
      setReplacingColorIndex(null);
    }
    saveColorImages(activeColorId, updated);
  };

  const handleSetColorPrimary = (index: number) => {
    if (!activeColorId || index === 0) return;
    const item = colorImages[index];
    const rest = colorImages.filter((_, i) => i !== index);
    const updated = [item, ...rest];
    saveColorImages(activeColorId, updated);
  };

  return (
    <div className="space-y-6 pt-4 border-t border-neutral-200">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleGeneralFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={handleReplaceGeneralFile}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={colorFileInputRef}
        onChange={handleColorFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={replaceColorFileInputRef}
        onChange={handleReplaceColorFile}
        accept="image/*"
        className="hidden"
      />

      {/* ==================================================== */}
      {/* SECTION 1: GENERAL CAR IMAGES & DEFAULT PHOTO */}
      {/* ==================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-2 font-mono">
              <ImageIcon className="w-4 h-4 text-red-600" />
              <span>General Car Images & Default Photo ({generalImages.length}/12)</span>
            </h5>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Full control over all vehicle photos. Delete, replace, upload new images, or set any photo as the main/default image.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              id="btn-upload-car-image"
              onClick={() => {
                fileInputRef.current?.click();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photos</span>
            </button>

            <button
              type="button"
              id="btn-add-url-car-image"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold border border-neutral-200 flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </div>
        </div>

        {/* Upload Status / Feedback Banner */}
        {isUploading && (
          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs animate-in fade-in duration-150">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
            <span className="font-medium">{uploadMessage || 'Uploading photo to persistent disk storage...'}</span>
          </div>
        )}

        {uploadError && (
          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <div className="flex-1 font-medium">{uploadError}</div>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-red-700 hover:text-red-900 font-bold px-1"
            >
              &times;
            </button>
          </div>
        )}

        {/* URL Input Bar */}
        {showUrlInput && (
          <div className="flex gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 animate-in fade-in duration-150">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddGeneralUrl();
                }
              }}
              placeholder="Paste image URL (e.g. https://... or /uploads/...)"
              className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 shadow-2xs focus:outline-none focus:border-red-600"
            />
            <button
              type="button"
              onClick={handleAddGeneralUrl}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
            >
              Add Photo
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(false);
                setUrlInput('');
              }}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Drag and Drop Zone if empty */}
        {generalImages.length === 0 && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsGeneralDragOver(true);
            }}
            onDragLeave={() => setIsGeneralDragOver(false)}
            onDrop={handleGeneralDrop}
            className={`p-8 text-center rounded-2xl border-2 border-dashed transition-all ${
              isGeneralDragOver
                ? 'border-red-500 bg-red-50/50 text-red-700'
                : 'border-neutral-300 bg-neutral-50/70 text-neutral-500'
            }`}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
            <p className="text-xs font-semibold text-neutral-800">
              No car images currently assigned.
            </p>
            <p className="text-[11px] text-neutral-500 mt-1 mb-3">
              Drag & drop photos here, upload from your device, or add an image URL.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Upload Image
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold border border-neutral-300 cursor-pointer shadow-2xs"
              >
                Enter URL
              </button>
            </div>
          </div>
        )}

        {/* Image Grid with Complete Admin Control */}
        {generalImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-1">
            {generalImages.map((imgUrl, idx) => {
              const isDefault = idx === 0;
              const isReplacing = replacingGeneralIndex === idx;

              return (
                <div
                  key={idx}
                  id={`car-image-card-${idx}`}
                  className={`group relative flex flex-col rounded-2xl overflow-hidden bg-neutral-50 border transition-all ${
                    isDefault
                      ? 'border-red-500 ring-2 ring-red-500/30 shadow-md bg-white'
                      : 'border-neutral-200 hover:border-neutral-300 shadow-2xs bg-white'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-[16/10] bg-neutral-200 overflow-hidden">
                    <img
                      src={resolveAssetUrl(imgUrl)}
                      alt={`Vehicle visual ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Status Badge */}
                    {isDefault ? (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-md font-mono flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Main / Default</span>
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-xs text-white font-mono shadow-xs">
                        Photo #{idx + 1}
                      </span>
                    )}

                    {/* Quick Set as Default Button on top right if not default */}
                    {!isDefault && (
                      <button
                        type="button"
                        id={`btn-set-default-${idx}`}
                        onClick={() => handleSetPrimary(idx)}
                        className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 hover:bg-amber-600 text-white backdrop-blur-xs text-[10px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
                        title="Set this image as the main/default car picture"
                      >
                        <Star className="w-3 h-3" />
                        <span>Set as Main</span>
                      </button>
                    )}
                  </div>

                  {/* Inline Replacement Form */}
                  {isReplacing && (
                    <div className="p-2.5 bg-neutral-100 border-t border-neutral-200 space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 font-mono">
                          Replace Photo #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setReplacingGeneralIndex(null);
                            setReplaceUrlInput('');
                          }}
                          className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => replaceFileInputRef.current?.click()}
                          className="flex-1 py-1 px-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-semibold flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload File</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1 pt-1">
                        <input
                          type="url"
                          value={replaceUrlInput}
                          onChange={(e) => setReplaceUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleReplaceGeneralUrl();
                            }
                          }}
                          placeholder="Or paste image URL"
                          className="flex-1 px-2 py-1 bg-white border border-neutral-300 rounded text-[11px] text-neutral-900"
                        />
                        <button
                          type="button"
                          onClick={handleReplaceGeneralUrl}
                          className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold cursor-pointer"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Complete Action Controls Bar */}
                  <div className="p-2 bg-white border-t border-neutral-200 flex items-center justify-between gap-1">
                    {/* Left Reorder */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveGeneralImage(idx, 'left')}
                      className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Move Left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Set Default / Star */}
                    {!isDefault ? (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="px-2 py-1 rounded-lg text-neutral-700 hover:text-amber-700 hover:bg-amber-50 text-[11px] font-semibold flex items-center space-x-1 cursor-pointer border border-transparent hover:border-amber-200"
                        title="Make this the default main photo"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <span>Make Main</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-red-600 uppercase font-mono px-1">
                        Default Image
                      </span>
                    )}

                    {/* Replace Button */}
                    <button
                      type="button"
                      id={`btn-replace-image-${idx}`}
                      onClick={() => {
                        setReplacingGeneralIndex(isReplacing ? null : idx);
                        setReplaceUrlInput('');
                      }}
                      className={`p-1.5 rounded-lg text-neutral-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer ${
                        isReplacing ? 'bg-blue-100 text-blue-800' : ''
                      }`}
                      title="Replace with another image"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    {/* Right Reorder */}
                    <button
                      type="button"
                      disabled={idx === generalImages.length - 1}
                      onClick={() => handleMoveGeneralImage(idx, 'right')}
                      className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Move Right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Delete Button (Allowed on all images including index 0 default!) */}
                    <button
                      type="button"
                      id={`btn-delete-image-${idx}`}
                      onClick={() => handleDeleteGeneralImage(idx)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                      title={isDefault ? "Delete Main Default Image" : "Delete Image"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* SECTION 2: CAR COLOR MANAGEMENT & COLOR PHOTOS */}
      {/* ==================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-2 font-mono">
              <Palette className="w-4 h-4 text-red-600" />
              <span>Exterior Color Configurations ({vehicleColors.length})</span>
            </h5>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Manage exterior color options. Each color can have custom color-matched photography.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowAddCustomColor(!showAddCustomColor)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold border border-neutral-200 flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom Color</span>
            </button>
          </div>
        </div>

        {/* Quick Add Tesla Color Presets */}
        <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
          <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-neutral-500 block">
            Quick Add Tesla Factory Colors:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TESLA_COLOR_PRESETS.map((preset) => {
              const isAdded = vehicleColors.some((c) => c.name.toLowerCase() === preset.name.toLowerCase());
              return (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isAdded}
                  onClick={() => handleAddPresetColor(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-neutral-200 text-neutral-400 cursor-default opacity-60'
                      : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 shadow-2xs hover:border-neutral-300'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/20 flex-shrink-0"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span>{preset.name}</span>
                  {isAdded && <Check className="w-3 h-3 text-emerald-600 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Custom Color Form */}
        {showAddCustomColor && (
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-center gap-3 animate-in fade-in duration-150">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-neutral-700">Name:</label>
              <input
                type="text"
                value={customColorName}
                onChange={(e) => setCustomColorName(e.target.value)}
                placeholder="e.g. Metallic Bronze"
                className="px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 shadow-2xs"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-neutral-700">Swatch:</label>
              <input
                type="color"
                value={customColorHex}
                onChange={(e) => setCustomColorHex(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300 p-0 bg-transparent"
              />
              <span className="text-xs font-mono text-neutral-600">{customColorHex}</span>
            </div>

            <button
              type="button"
              onClick={handleAddCustomColor}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
            >
              Add Color
            </button>
            <button
              type="button"
              onClick={() => setShowAddCustomColor(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active Colors List with Color-Specific Photos */}
        {vehicleColors.length > 0 ? (
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase font-mono tracking-wider text-neutral-500 block">
              Configured Vehicle Colors:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {vehicleColors.map((color) => {
                const isSelectedForImages = (activeColorId === color.id);
                const count = color.images?.length || 0;

                return (
                  <div
                    key={color.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelectedForImages
                        ? 'bg-red-50/50 border-red-300 shadow-xs ring-2 ring-red-500/20'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center space-x-2.5">
                        <span
                          className="w-5 h-5 rounded-full border border-black/20 shadow-xs flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div>
                          <span className="text-xs font-bold text-neutral-900 block leading-tight">
                            {color.name}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {color.hex} • {count > 0 ? `${count} photo${count > 1 ? 's' : ''}` : 'Uses general photos'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove Color"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Color-Specific Images Toggle */}
                    <button
                      type="button"
                      onClick={() => setActiveColorId(isSelectedForImages ? null : color.id)}
                      className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                        isSelectedForImages
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-[#F8F9FA] hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>
                        {isSelectedForImages
                          ? 'Close Color Photos'
                          : `Manage Photos (${count}/10)`}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center rounded-2xl border border-dashed border-neutral-300 text-xs text-neutral-500">
            No colors configured yet. Choose from quick-add Tesla factory colors or create custom swatches above.
          </div>
        )}

        {/* ==================================================== */}
        {/* SECTION 3: COLOR-SPECIFIC IMAGES MODAL / DRAWER */}
        {/* ==================================================== */}
        {activeColor && (
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-red-200 space-y-4 animate-in fade-in duration-150 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200">
              <div className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                  style={{ backgroundColor: activeColor.hex }}
                />
                <span className="text-xs font-bold text-neutral-900 font-mono">
                  Photos for {activeColor.name} ({colorImages.length}/10)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {colorImages.length < 10 && (
                  <button
                    type="button"
                    onClick={() => colorFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload for Color</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveColorId(null)}
                  className="text-xs text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 cursor-pointer shadow-2xs"
                >
                  Done
                </button>
              </div>
            </div>

            {colorImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {colorImages.map((imgUrl, idx) => {
                  const isColorPrimary = idx === 0;
                  const isColorReplacing = replacingColorIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-2xs"
                    >
                      <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                        <img
                          src={resolveAssetUrl(imgUrl)}
                          alt={`${activeColor.name} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isColorPrimary ? (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-xs font-mono">
                            Color Primary
                          </span>
                        ) : (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white font-mono">
                            #{idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Inline Replace for Color */}
                      {isColorReplacing && (
                        <div className="p-2 bg-neutral-100 border-t border-neutral-200 space-y-1.5">
                          <button
                            type="button"
                            onClick={() => replaceColorFileInputRef.current?.click()}
                            className="w-full py-1 px-2 rounded bg-neutral-900 text-white text-[11px] font-semibold cursor-pointer"
                          >
                            Upload Replacement
                          </button>
                          <div className="flex items-center gap-1">
                            <input
                              type="url"
                              value={replaceColorUrlInput}
                              onChange={(e) => setReplaceColorUrlInput(e.target.value)}
                              placeholder="Or paste URL"
                              className="flex-1 px-2 py-1 bg-white border border-neutral-300 rounded text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={handleReplaceColorUrl}
                              className="px-2 py-1 bg-blue-600 text-white rounded text-[11px]"
                            >
                              Set
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="p-1.5 bg-white border-t border-neutral-200 flex items-center justify-between gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveColorImage(idx, 'left')}
                          className="p-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 cursor-pointer"
                          title="Move Left"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        {!isColorPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetColorPrimary(idx)}
                            className="p-1 text-neutral-500 hover:text-amber-600 cursor-pointer"
                            title="Make Primary for this Color"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setReplacingColorIndex(isColorReplacing ? null : idx)}
                          className="p-1 text-neutral-500 hover:text-blue-600 cursor-pointer"
                          title="Replace"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={idx === colorImages.length - 1}
                          onClick={() => handleMoveColorImage(idx, 'right')}
                          className="p-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 cursor-pointer"
                          title="Move Right"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteColorImage(idx)}
                          className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                          title="Delete Color Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center rounded-xl bg-white border border-dashed border-neutral-300 text-xs text-neutral-500">
                No color-specific photos assigned yet. This color will automatically display the car's general images.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

