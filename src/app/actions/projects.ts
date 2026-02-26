'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import cloudinary from '@/lib/cloudinary'

async function checkAdmin() {
    const { userId } = await auth()
    const allowedId = process.env.ALLOWED_USER_ID
    if (!userId || (allowedId && allowedId !== 'user_2xxxxxxxxxxxxxxxxxxxxxxx' && userId !== allowedId)) {
        throw new Error('Unauthorized')
    }
}

async function uploadToCloudinary(file: File, folder: string) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: `portfolio/projects/${folder}`,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) reject(error)
                else resolve(result?.secure_url || '')
            }
        ).end(buffer)
    })
}

export async function getProjects() {
    return await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export async function getProjectById(id: number) {
    return await prisma.project.findUnique({
        where: { id },
    })
}

export async function deleteProject(id: number) {
    await checkAdmin()
    await prisma.project.delete({
        where: { id },
    })
    revalidatePath('/')
    revalidatePath('/admin')
}

export async function createProject(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        await checkAdmin()

        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const category = formData.get('category') as string
        const techStack = formData.get('techStack') as string

        // UX Fields
        const personaName = formData.get('personaName') as string
        const personaBio = formData.get('personaBio') as string
        const painPoints = formData.get('painPoints') as string
        const userJourneyData = formData.get('userJourneyData') as string

        // Empathy Map
        const empathySays = formData.get('empathySays') as string
        const empathyThinks = formData.get('empathyThinks') as string
        const empathyFeels = formData.get('empathyFeels') as string
        const empathyDoes = formData.get('empathyDoes') as string

        const imageFile = formData.get('imageFile') as File | null
        const imageUrlInput = formData.get('imageUrl') as string
        const personaFile = formData.get('personaFile') as File | null
        const personaImageUrlInput = formData.get('personaImage') as string

        let imageUrl = imageUrlInput
        let personaImage = personaImageUrlInput

        // Upload Main Project Image
        if (imageFile && imageFile.size > 0) {
            try {
                imageUrl = await uploadToCloudinary(imageFile, 'covers')
            } catch (error) {
                console.error('Cloudinary Upload Error (Cover):', error)
                return { success: false, error: 'Fehler beim Hochladen des Projekt-Covers' }
            }
        }

        // Upload Persona Image
        if (personaFile && personaFile.size > 0) {
            try {
                personaImage = await uploadToCloudinary(personaFile, 'personas')
            } catch (error) {
                console.error('Cloudinary Upload Error (Persona):', error)
                return { success: false, error: 'Fehler beim Hochladen des Persona-Bildes' }
            }
        }

        // Upload Gallery Images
        const galleryUrls: string[] = []
        for (let i = 0; i < 5; i++) {
            const galleryFile = formData.get(`galleryFile_${i}`) as File | null
            const galleryUrlInput = formData.get(`galleryUrl_${i}`) as string
            if (galleryFile && galleryFile.size > 0) {
                try {
                    galleryUrls.push(await uploadToCloudinary(galleryFile, 'gallery'))
                } catch (error) {
                    console.error(`Cloudinary Upload Error (Gallery ${i}):`, error)
                }
            } else if (galleryUrlInput) {
                galleryUrls.push(galleryUrlInput)
            }
        }
        const galleryImages = galleryUrls.length > 0 ? JSON.stringify(galleryUrls) : null

        await (prisma.project as any).create({
            data: {
                title,
                description,
                category,
                techStack,
                imageUrl,
                personaName,
                personaImage,
                personaBio,
                painPoints,
                userJourneyData,
                empathySays,
                empathyThinks,
                empathyFeels,
                empathyDoes,
                galleryImages,
            } as any,
        })

        revalidatePath('/')
        revalidatePath('/admin')
        return { success: true }
    } catch (err) {
        console.error('createProject error:', err)
        return { success: false, error: err instanceof Error ? err.message : 'Unbekannter Fehler' }
    }
}

export async function updateProject(id: number, formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        await checkAdmin()

        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const category = formData.get('category') as string
        const techStack = formData.get('techStack') as string

        // UX Fields
        const personaName = formData.get('personaName') as string
        const personaBio = formData.get('personaBio') as string
        const painPoints = formData.get('painPoints') as string
        const userJourneyData = formData.get('userJourneyData') as string

        // Empathy Map
        const empathySays = formData.get('empathySays') as string
        const empathyThinks = formData.get('empathyThinks') as string
        const empathyFeels = formData.get('empathyFeels') as string
        const empathyDoes = formData.get('empathyDoes') as string

        const imageFile = formData.get('imageFile') as File | null
        const imageUrlInput = formData.get('imageUrl') as string
        const personaFile = formData.get('personaFile') as File | null
        const personaImageUrlInput = formData.get('personaImage') as string

        let imageUrl = imageUrlInput
        let personaImage = personaImageUrlInput

        // Upload Main Project Image if a new one is provided
        if (imageFile && imageFile.size > 0) {
            try {
                imageUrl = await uploadToCloudinary(imageFile, 'covers')
            } catch (error) {
                console.error('Cloudinary Upload Error (Cover):', error)
                return { success: false, error: 'Fehler beim Hochladen des Projekt-Covers' }
            }
        }

        // Upload Persona Image if a new one is provided
        if (personaFile && personaFile.size > 0) {
            try {
                personaImage = await uploadToCloudinary(personaFile, 'personas')
            } catch (error) {
                console.error('Cloudinary Upload Error (Persona):', error)
                return { success: false, error: 'Fehler beim Hochladen des Persona-Bildes' }
            }
        }

        // Upload Gallery Images (merge existing with new)
        const existingGalleryJson = formData.get('existingGallery') as string
        const existingGallery: string[] = existingGalleryJson ? JSON.parse(existingGalleryJson) : []
        const galleryUrls: string[] = [...existingGallery]
        for (let i = 0; i < 5; i++) {
            const galleryFile = formData.get(`galleryFile_${i}`) as File | null
            const galleryUrlInput = formData.get(`galleryUrl_${i}`) as string
            if (galleryFile && galleryFile.size > 0) {
                try {
                    galleryUrls.push(await uploadToCloudinary(galleryFile, 'gallery'))
                } catch (error) {
                    console.error(`Cloudinary Upload Error (Gallery ${i}):`, error)
                }
            } else if (galleryUrlInput) {
                galleryUrls.push(galleryUrlInput)
            }
        }
        const galleryImages = galleryUrls.length > 0 ? JSON.stringify(galleryUrls) : null

        await (prisma.project as any).update({
            where: { id },
            data: {
                title,
                description,
                category,
                techStack,
                imageUrl,
                personaName,
                personaImage,
                personaBio,
                painPoints,
                userJourneyData,
                empathySays,
                empathyThinks,
                empathyFeels,
                empathyDoes,
                galleryImages,
            } as any,
        })

        revalidatePath('/')
        revalidatePath('/admin')
        return { success: true }
    } catch (err) {
        console.error('updateProject error:', err)
        return { success: false, error: err instanceof Error ? err.message : 'Unbekannter Fehler' }
    }
}
