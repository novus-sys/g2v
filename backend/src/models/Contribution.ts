import mongoose, { Document, Schema } from "mongoose";

export interface IContribution extends Document {
  group: mongoose.Types.ObjectId;
  contributor: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contributionSchema = new Schema<IContribution>(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    contributor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
contributionSchema.index({ group: 1, contributor: 1 });
contributionSchema.index({ status: 1 });

// Update group's currentAmount when contribution is completed
contributionSchema.post("save", async function (doc) {
  if (doc.status === "completed") {
    const Group = mongoose.model("Group");
    await Group.findByIdAndUpdate(
      doc.group,
      { $inc: { currentAmount: doc.amount } },
      { new: true }
    );
  }
});

const Contribution = mongoose.model<IContribution>(
  "Contribution",
  contributionSchema
);

export default Contribution;
