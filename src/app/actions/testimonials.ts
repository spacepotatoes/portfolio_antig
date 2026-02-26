'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTestimonials() {
    return prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function createTestimonial(data: {
    name: string
    role: string
    company?: string
    avatar?: string
    rating: number
    text: string
}) {
    const testimonial = await prisma.testimonial.create({ data })
    revalidatePath('/')
    return testimonial
}

export async function updateTestimonial(id: number, data: {
    name: string
    role: string
    company?: string
    avatar?: string
    rating: number
    text: string
}) {
    const testimonial = await prisma.testimonial.update({ where: { id }, data })
    revalidatePath('/')
    return testimonial
}

export async function deleteTestimonial(id: number) {
    await prisma.testimonial.delete({ where: { id } })
    revalidatePath('/')
}
