'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { PlusCircle, Save, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Memory {
  id: string;
  content: string;
  isActive: boolean;
}

interface Assistant {
  id: string;
  name: string;
  instructions: string;
}

export default function AssistantManager() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [userInput, setUserInput] = useState('');
  const [newAssistant, setNewAssistant] = useState({ name: '', instructions: '' });

  const handleSaveAssistant = () => {
    if (newAssistant.name && newAssistant.instructions) {
      setAssistants([...assistants, { ...newAssistant, id: Date.now().toString() }]);
      setNewAssistant({ name: '', instructions: '' });
    }
  };

  const handleAddMemory = () => {
    const newMemory: Memory = {
      id: Date.now().toString(),
      content: '',
      isActive: true,
    };
    setMemories([...memories, newMemory]);
  };

  const handleSaveMemory = (id: string, content: string) => {
    setMemories(memories.map(memory => 
      memory.id === id ? { ...memory, content, isActive: false } : memory
    ));
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(memories.filter(memory => memory.id !== id));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(assistants);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setAssistants(items);
  };

  const handleStart = async () => {
    const payload = {
      assistants: assistants,
      memories: memories.filter(m => !m.isActive).map(m => m.content),
      userInput
    };
    
    // TODO: Implement API call to ChatGPT Assistant
    console.log('Starting with payload:', payload);
  };

  return (
    <div className="space-y-8">
      {/* Assistant Instructions Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Assistant Instructions</h2>
        <div className="space-y-4">
          <Input
            placeholder="Assistant Name"
            value={newAssistant.name}
            onChange={(e) => setNewAssistant({ ...newAssistant, name: e.target.value })}
          />
          <Textarea
            placeholder="Enter instructions for the assistant..."
            value={newAssistant.instructions}
            onChange={(e) => setNewAssistant({ ...newAssistant, instructions: e.target.value })}
          />
          <Button onClick={handleSaveAssistant}>
            <Save className="w-4 h-4 mr-2" />
            Save Assistant
          </Button>
        </div>
      </section>

      {/* Assistant Sequence Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Assistant Sequence</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="assistants">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {assistants.map((assistant, index) => (
                  <Draggable
                    key={assistant.id}
                    draggableId={assistant.id}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-4 bg-white"
                      >
                        <h3 className="font-semibold">{assistant.name}</h3>
                        <p className="text-sm text-gray-600">{assistant.instructions}</p>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>

      {/* Memory Blocks Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Memory Blocks</h2>
        <Button onClick={handleAddMemory}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Memory
        </Button>
        <div className="space-y-4">
          {memories.map((memory) => (
            <Card key={memory.id} className={`p-4 ${!memory.isActive ? 'bg-blue-50' : 'bg-white'}`}>
              <div className="space-y-2">
                <Textarea
                  placeholder="Enter memory content..."
                  value={memory.content}
                  onChange={(e) => setMemories(memories.map(m => 
                    m.id === memory.id ? { ...m, content: e.target.value } : m
                  ))}
                  disabled={!memory.isActive}
                />
                <div className="flex space-x-2">
                  {memory.isActive && (
                    <Button onClick={() => handleSaveMemory(memory.id, memory.content)}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  )}
                  <Button variant="destructive" onClick={() => handleDeleteMemory(memory.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* User Input Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">User Input</h2>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleStart} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Start
          </Button>
        </div>
      </section>
    </div>
  );
}