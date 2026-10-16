import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // If userId provided, return student-specific statement
    if (userId) {
      const orders = await prisma.paymentOrder.findMany({
        where: { userId },
        orderBy: { installmentNumber: "asc" },
      });

      const enrollment = await prisma.enrollment.findFirst({
        where: { userId },
        include: { course: true, batch: true },
      });

      return NextResponse.json({
        success: true,
        orders,
        enrollment,
      });
    }

    // Otherwise, return full academy finance overview
    const allOrders = await prisma.paymentOrder.findMany({
      include: {
        user: true,
        enrollment: {
          include: {
            course: true,
            batch: {
              include: { branch: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const paidOrders = allOrders.filter((o) => o.status === "Paid");
    const totalCollections = paidOrders.reduce((sum, o) => sum + o.amount, 0);

    const pendingOrders = allOrders.filter((o) => o.status !== "Paid");
    const pendingReceivables = pendingOrders.reduce((sum, o) => sum + o.amount, 0);

    const now = new Date();
    const overdueCount = allOrders.filter(
      (o) => o.status !== "Paid" && o.dueDate && new Date(o.dueDate) < now
    ).length;

    // Collections by Branch
    const collectionsByCampus: Record<string, number> = {
      "Chennai Head Office (Pallikaranai)": 0,
      "Coimbatore Campus (Sundarapuram)": 0,
      "Perambalur Campus (Annai Hospital)": 0,
      "Karaikudi Campus (TT Nagar)": 0,
    };

    paidOrders.forEach((o) => {
      const branchName = o.enrollment?.batch?.branch?.name || "Chennai Head Office (Pallikaranai)";
      if (collectionsByCampus[branchName] !== undefined) {
        collectionsByCampus[branchName] += o.amount;
      } else {
        collectionsByCampus["Chennai Head Office (Pallikaranai)"] += o.amount;
      }
    });

    return NextResponse.json({
      success: true,
      totalCollections,
      pendingReceivables,
      overdueCount,
      totalTransactions: allOrders.length,
      recentTransactions: allOrders,
      collectionsByCampus,
    });
  } catch (err: any) {
    console.error("Error fetching finance metrics:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
