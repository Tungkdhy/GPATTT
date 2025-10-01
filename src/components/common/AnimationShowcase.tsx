import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Sparkles, 
  Zap, 
  Rocket, 
  Star, 
  Heart,
  Play,
  RefreshCw
} from 'lucide-react';

export function AnimationShowcase() {
  const [triggerAnimation, setTriggerAnimation] = useState(0);

  const triggerDemo = () => {
    setTriggerAnimation(prev => prev + 1);
  };

  return (
    <Card className="card-hover fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Animation Showcase
        </CardTitle>
        <CardDescription>
          Khám phá các hiệu ứng động đẹp mắt của hệ thống
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Animation Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={triggerDemo} 
            className="btn-animate scale-hover btn-press"
          >
            <Play className="mr-2 h-4 w-4" />
            Chạy Demo
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="scale-hover"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Basic Animations */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card key={`fade-${triggerAnimation}`} className="stagger-item">
            <CardContent className="p-4 text-center">
              <Rocket className="h-8 w-8 mx-auto text-blue-500 bounce-soft" />
              <p className="mt-2">Bounce Effect</p>
            </CardContent>
          </Card>

          <Card key={`slide-${triggerAnimation}`} className="slide-in-left">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 mx-auto text-yellow-500 float" />
              <p className="mt-2">Float Animation</p>
            </CardContent>
          </Card>

          <Card key={`zoom-${triggerAnimation}`} className="zoom-in">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto text-purple-500 pulse-slow" />
              <p className="mt-2">Pulse Effect</p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Elements */}
        <div className="space-y-4">
          <h3 className="font-medium">Interactive Elements</h3>
          
          <div className="flex flex-wrap gap-3">
            <Badge 
              key={`badge-${triggerAnimation}`}
              className="badge-bounce notification-badge"
            >
              Animated Badge
            </Badge>
            
            <Button 
              variant="outline" 
              className="rubber-band hover:head-shake"
              style={{animationDelay: '0.2s'}}
            >
              Fun Button
            </Button>
            
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 pulse-slow" />
              <span className="typewriter">Typing Effect...</span>
            </div>
          </div>
        </div>

        {/* Progress Animation */}
        <div className="space-y-2">
          <h3 className="font-medium">Animated Progress</h3>
          <div className="relative">
            <Progress 
              value={75} 
              className="progress-animate"
            />
            <div className="absolute inset-0 shimmer opacity-50"></div>
          </div>
        </div>

        {/* Stagger Animation Demo */}
        <div className="space-y-2">
          <h3 className="font-medium">Stagger Animation</h3>
          <div className="grid gap-2 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`stagger-${triggerAnimation}-${i}`}
                className="stagger-item h-16 bg-gradient-to-r from-primary/20 to-primary/40 rounded-lg flex items-center justify-center"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                <span className="font-medium">#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Glow Effect */}
        <div className="text-center">
          <Button 
            className="glow scale-hover"
            style={{animationDelay: '1s'}}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Glowing Button
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}