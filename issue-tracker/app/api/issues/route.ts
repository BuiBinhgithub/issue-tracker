import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { title } from "process";
import { z } from "zod";

const createIssueSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
});

export async function GET() {
  const issues = await prisma.issues.findMany();
  return NextResponse.json(issues, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createIssueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }
  const createIssue = await prisma.issues.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });
  return NextResponse.json(createIssue, { status: 200 });
}
