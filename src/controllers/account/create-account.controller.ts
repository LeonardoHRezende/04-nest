import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { hash } from "bcryptjs";
import { z } from "zod";
import { PrismaService } from "src/prisma/prisma.service";
import { ZodValidationPipe } from "src/pipes/zod/zod-validation-pipe";

const createAccountSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255)
})

type createAccountSchemaType = z.infer<typeof createAccountSchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: createAccountSchemaType) {

    const { name, email, password } = body;

    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (userAlreadyExists) {
      throw new ConflictException('User already exists')
    }

    const hashedPassword = await hash(password, 4)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

  }
}