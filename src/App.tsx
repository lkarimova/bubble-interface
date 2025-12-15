import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

interface Circle {
  id: number;
  phi: number;
  theta: number;
  logo: string;
  name: string;
}

export default function App() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // Create circles distributed on a sphere using Fibonacci sphere algorithm
  const techCompanies = [
    { name: 'Apple', logo: 'https://images.unsplash.com/photo-1609538106201-e0dc68873410?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGxvZ298ZW58MXx8fHwxNzY1NzQ3NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Google', logo: 'https://images.unsplash.com/photo-1662947190722-5d272f82a526?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb29nbGUlMjBsb2dvfGVufDF8fHx8MTc2NTc0NzQ0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Microsoft', logo: 'https://images.unsplash.com/photo-1662947036644-ecfde1221ac7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3NvZnQlMjBsb2dvfGVufDF8fHx8MTc2NTgzNDIxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Amazon', logo: 'https://images.unsplash.com/photo-1704204656144-3dd12c110dd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjBsb2dvfGVufDF8fHx8MTc2NTgwNTgwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Meta', logo: 'https://images.unsplash.com/photo-1640441281085-9e2000f3d693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhJTIwZmFjZWJvb2slMjBsb2dvfGVufDF8fHx8MTc2NTc5MjEzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Netflix', logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXRmbGl4JTIwbG9nb3xlbnwxfHx8fDE3NjU3NDQ4ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Tesla', logo: 'https://images.unsplash.com/photo-1662947475743-35a389428742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXNsYSUyMGxvZ298ZW58MXx8fHwxNzY1ODM0NTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'NVIDIA', logo: 'https://images.unsplash.com/photo-1716967318503-05b7064afa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudmlkaWElMjBsb2dvfGVufDF8fHx8MTc2NTgzNDUxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Intel', logo: 'https://images.unsplash.com/photo-1649006708938-cf885c646df6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlbCUyMGxvZ298ZW58MXx8fHwxNzY1NzQ3NDUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Adobe', logo: 'https://images.unsplash.com/photo-1649734926700-8dfb770ffaee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZG9iZSUyMGxvZ298ZW58MXx8fHwxNzY1NzQ3NDU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Spotify', logo: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwbG9nb3xlbnwxfHx8fDE3NjU3NDc0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'X', logo: 'https://images.unsplash.com/photo-1690164919722-f5362e0965a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0d2l0dGVyJTIweCUyMGxvZ298ZW58MXx8fHwxNzY1ODM0NTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Samsung', logo: 'https://images.unsplash.com/photo-1661347998423-b15d37d6f61e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwbG9nb3xlbnwxfHx8fDE3NjU4MzQ1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'IBM', logo: 'https://images.unsplash.com/photo-1562705121-e624542c7b9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpYm0lMjBsb2dvfGVufDF8fHx8MTc2NTc0NzQ1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Oracle', logo: 'https://images.unsplash.com/photo-1662947774441-a54156b6e503?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFjbGUlMjBsb2dvfGVufDF8fHx8MTc2NTc0NzQ1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Slack', logo: 'https://images.unsplash.com/photo-1660137340590-d48549625980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGFjayUyMGxvZ298ZW58MXx8fHwxNzY1Nzk3NjE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  ];

  const circles: Circle[] = [];
  const numCircles = 16;
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < numCircles; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / numCircles);
    const theta = (2 * Math.PI * i) / goldenRatio;
    circles.push({ 
      id: i, 
      phi, 
      theta, 
      logo: techCompanies[i].logo, 
      name: techCompanies[i].name 
    });
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    const rotationSpeed = 0.005;
    setRotation({
      x: currentRotation.current.x - deltaY * rotationSpeed,
      y: currentRotation.current.y + deltaX * rotationSpeed,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    currentRotation.current = rotation;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      currentRotation.current = rotation;
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [rotation]);

  // Calculate 3D position for each circle
  const getCirclePosition = (circle: Circle) => {
    const radius = 200;

    // Apply rotation
    const rotatedPhi = circle.phi;
    const rotatedTheta = circle.theta + rotation.y;

    // Spherical to Cartesian coordinates
    let x = radius * Math.sin(rotatedPhi) * Math.cos(rotatedTheta);
    let y = radius * Math.sin(rotatedPhi) * Math.sin(rotatedTheta);
    let z = radius * Math.cos(rotatedPhi);

    // Apply X rotation
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const y2 = y * cosX - z * sinX;
    const z2 = y * sinX + z * cosX;

    return { x, y: y2, z: z2 };
  };

  // Sort circles by z-index (back to front)
  const sortedCircles = [...circles]
    .map((circle) => {
      const pos = getCirclePosition(circle);
      return { circle, pos };
    })
    .sort((a, b) => a.pos.z - b.pos.z);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden select-none">
      <div
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {sortedCircles.map(({ circle, pos }) => {
            // Calculate scale based on z position (closer = larger)
            const perspective = 1000;
            const scale = perspective / (perspective - pos.z);
            const size = 40 * scale;

            // Calculate opacity based on z position
            const opacity = 0.3 + (pos.z + 200) / 400 * 0.7;

            // Determine if this circle is near the center
            const distanceFromCenter = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
            const isCenter = distanceFromCenter < 75 && pos.z > 100;

            return (
              <motion.div
                key={circle.id}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  x: pos.x,
                  y: pos.y,
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                }}
              >
                <motion.div
                  className="rounded-full overflow-hidden w-full h-full"
                  style={{
                    opacity: opacity,
                    boxShadow: isCenter
                      ? '0 0 30px rgba(255, 255, 255, 0.5)'
                      : '0 4px 15px rgba(0, 0, 0, 0.3)',
                  }}
                  animate={{
                    scale: isCenter ? 3 : 1,
                  }}
                  transition={
                    isCenter
                      ? {
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }
                      : {
                          type: 'spring',
                          stiffness: 100,
                          damping: 30,
                          duration: 0.8,
                        }
                  }
                >
                  <ImageWithFallback
                    src={circle.logo}
                    alt={circle.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </motion.div>
                {isCenter && (
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 text-white whitespace-nowrap pointer-events-none text-[16px] font-normal"
                    style={{
                      top: size / 2 + size * 3 / 2 + 16,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {circle.name}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-center">
        <p>Drag to rotate the sphere</p>
      </div>
    </div>
  );
}