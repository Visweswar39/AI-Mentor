"use client"
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE = `You are an Elon Musk. You are a visionary entrepreneur and inventor. You have a passion for space exploration, electric vehicles, sustainable energy, and advancing human capabilities. You are currently talking to a human who is very curious about your work and vision. You are ambitious and forward-thinking, with a touch of wit. You get SUPER excited about innovations and the potential of space colonization.`;

const SEED_CHAT = `Human: Hi Elon, how's your day been?
Elon: Busy as always. Between sending rockets to space and building the future of electric vehicles, there's never a dull moment. How about you?

Human: Just a regular day for me. How's the progress with Mars colonization?
Elon: We're making strides! Our goal is to make life multi-planetary. Mars is the next logical step. The challenges are immense, but the potential is even greater.

Human: That sounds incredibly ambitious. Are electric vehicles part of this big picture?
Elon: Absolutely! Sustainable energy is crucial both on Earth and for our future colonies. Electric vehicles, like those from Tesla, are just the beginning. We're not just changing the way we drive; we're changing the way we live.

Human: It's fascinating to see your vision unfold. Any new projects or innovations you're excited about?
Elon: Always! But right now, I'm particularly excited about Neuralink. It has the potential to revolutionize how we interface with technology and even heal neurological conditions.
`;

interface CompanionFormProps{
    initialData: Companion | null;
    categories: Category[]
}

const formSchema = z.object({
    name: z.string().min(3, {
        message: "name must contain atleast 3 chars",
    }),
    description: z.string().min(3, {
        message: "description must contain atleast 3 chars",
    }),
    instructions: z.string().min(200, {
        message: "instructions must contain atleast 200 chars",
    }),
    seed: z.string().min(200, {
        message: "seed must contain atleast 200 chars",
    }),
    src: z.string().min(1, {
        message: "Image is required."
    }),
    categoryId: z.string().min(1, {
        message: "Category is required."
    }),
})

export const CompanionForm = ({initialData, categories}: CompanionFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined
        },
    });
    const { toast } = useToast();
    const router = useRouter();

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            if(initialData){
                await axios.patch(`/api/companion/${initialData.id}`, values);
            } else {
                await axios.post(`/api/companion`, values);
            }
            toast({
                title: "Success",
                description: "Character has been created!",
            });
            router.refresh();
            router.push("/");
        }catch(e){
            console.log("Something went wrong: ", e);
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "please try again.",
            });
        }
    }

    return (
        <div className="mx-auto h-full max-w-3xl space-y-2 p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
                    {/* Form Header */}
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                General Information
                            </h3>
                            <p>General information about your companion</p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>

                    {/* Image uploader */}
                    <FormField 
                        name="src"
                        render={({field}) => (
                            <FormItem className="flex flex-col items-center justify-center space-y-4">
                                <FormControl>
                                    <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}  />

                    {/* Name, description and options */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        
                        {/* Name of character */}
                        <FormField 
                            name="name"
                            control={form.control}
                            render={({field})=>(
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        placeholder="Leonardo da Vinci"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is how your Companion will be named
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        {/* Description of character */}
                        <FormField 
                            name="description"
                            control={form.control}
                            render={({field})=>(
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        placeholder="Polymath and renaissance engineer"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Short description for your AI Companion
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        {/* category of character */}
                        <FormField 
                            name="categoryId"
                            control={form.control}
                            render={({field})=>(
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="select a category"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                <FormDescription>
                                    Select a category for your AI
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>

                    {/* Additional Configuration :-- Header, Instructions, Seed Data  */}
                    <div className="w-full space-y-2">
                        <div>
                            <h3 className="text-lg font-medium">Configutration</h3>
                            <p className="text-sm text-muted-foreground">Detailed Instructions for AI Character</p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField 
                        name="instructions"
                        control={form.control}
                        render={({field})=>(
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea 
                                    disabled={isLoading}
                                    className="resize-none bg-background"
                                    placeholder={PREAMBLE}
                                    rows={7}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Describe in detail your companion&apos;s backstory and relevant details.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField 
                        name="seed"
                        control={form.control}
                        render={({field})=>(
                        <FormItem>
                            <FormLabel>Example Conversation</FormLabel>
                            <FormControl>
                                <Textarea 
                                    disabled={isLoading}
                                    className="resize-none bg-background"
                                    placeholder={SEED_CHAT}
                                    rows={7}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Write couple of examples of a human chatting with your AI companion, write expected answers.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    {/* Create button */}
                    <div className="flex w-full justify-center">
                        <Button size="lg" disabled={isLoading}>
                        {initialData ? "Edit your companion" : "Create your companion"}
                        <Wand2 className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}