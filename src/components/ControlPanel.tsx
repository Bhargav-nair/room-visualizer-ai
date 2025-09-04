import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, Image, Lightbulb, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface LayoutSuggestion {
  id: string;
  type: "success" | "warning" | "info";
  message: string;
}

export function ControlPanel() {
  const [prompt, setPrompt] = useState("");
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [suggestions] = useState<LayoutSuggestion[]>([
    { id: "1", type: "success", message: "Room dimensions are optimal for furniture placement" },
    { id: "2", type: "warning", message: "Consider wider doorway for better accessibility" },
    { id: "3", type: "info", message: "Add natural lighting sources near seating area" },
  ]);

  const handleMagicPrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a style prompt first");
      return;
    }

    setIsGeneratingPrompt(true);
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const enhancedPrompt = `${prompt} with modern architectural details, optimal lighting, and premium materials in a contemporary style`;
      setPrompt(enhancedPrompt);
      toast.success("Prompt enhanced successfully!");
    } catch (error) {
      toast.error("Failed to enhance prompt");
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleGenerateTopView = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a style prompt first");
      return;
    }

    setIsGeneratingImage(true);
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Placeholder image - replace with actual generated image
      setGeneratedImage("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop");
      toast.success("Top view generated successfully!");
    } catch (error) {
      toast.error("Failed to generate top view");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSuggestionVariant = (type: string) => {
    switch (type) {
      case "success": return "default";
      case "warning": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 p-6 bg-gradient-surface">
      {/* Style Prompt Section */}
      <Card className="shadow-soft border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Style Prompt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your desired room style (e.g., 'Modern minimalist living room with warm lighting and natural materials')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none border-border/50 focus:ring-primary/50"
          />
          <div className="flex gap-3">
            <Button 
              variant="magic" 
              onClick={handleMagicPrompt}
              disabled={isGeneratingPrompt || !prompt.trim()}
              className="flex-1"
            >
              {isGeneratingPrompt ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Magic Prompt
                </>
              )}
            </Button>
            <Button 
              variant="generate" 
              onClick={handleGenerateTopView}
              disabled={isGeneratingImage || !prompt.trim()}
              className="flex-1"
            >
              {isGeneratingImage ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Image className="w-4 h-4" />
                  Generate Top View
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Image Preview */}
      {generatedImage && (
        <Card className="shadow-soft border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Image className="w-5 h-5 text-accent" />
              Generated Top View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border/50">
              <img 
                src={generatedImage} 
                alt="Generated room top view"
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout Suggestions */}
      <Card className="shadow-soft border-border/50 flex-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Layout Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-card transition-colors">
                {getSuggestionIcon(suggestion.type)}
                <div className="flex-1">
                  <p className="text-sm text-foreground/90">{suggestion.message}</p>
                </div>
                <Badge variant={getSuggestionVariant(suggestion.type) as any} className="text-xs">
                  {suggestion.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}