interface Block {
  id: string;
  nftId: string;
  patientId: string;
  recordData: any;
  blockHash: string;
  timestamp: number;
  previousHash: string;
}

interface TransactionHistory {
  hash: string;
  timestamp: number;
  action: string;
  details: string;
}

export class MockBlockchain {
  private blocks: Block[] = [];
  private transactionHistories: Map<string, TransactionHistory[]> = new Map();
  private nftIdCounter = 10000;

  constructor() {
    this.initializeDemoBlocks();
  }

  private initializeDemoBlocks() {
    // Pre-populate with demo NFTs
    const demoNFTs = [
      { nftId: "NFT-DEMO-001", patientId: "maria", name: "Maria Santos" },
      { nftId: "NFT-DEMO-002", patientId: "juan", name: "Juan Dela Cruz" },
    ];

    demoNFTs.forEach((nft) => {
      const block: Block = {
        id: `BLOCK-${this.blocks.length + 1}`,
        nftId: nft.nftId,
        patientId: nft.patientId,
        recordData: { patientName: nft.name },
        blockHash: this.generateHash(nft.nftId),
        timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
        previousHash: "0x0000000000000000",
      };
      this.blocks.push(block);

      // Initialize transaction history
      this.transactionHistories.set(nft.nftId, [
        {
          hash: block.blockHash,
          timestamp: block.timestamp,
          action: "mint",
          details: `NFT minted for patient ${nft.name}`,
        },
      ]);
    });
  }

  private generateHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, "0")}`;
  }

  addRecord(patientId: string, recordData: any): string {
    const nftId = `NFT-${++this.nftIdCounter}`;
    const blockHash = this.generateHash(
      `${nftId}-${JSON.stringify(recordData)}-${Date.now()}`
    );

    const block: Block = {
      id: `BLOCK-${this.blocks.length + 1}`,
      nftId,
      patientId,
      recordData,
      blockHash,
      timestamp: Date.now(),
      previousHash: this.blocks.length > 0 ? this.blocks[this.blocks.length - 1].blockHash : "0x0000000000000000",
    };

    this.blocks.push(block);

    if (!this.transactionHistories.has(nftId)) {
      this.transactionHistories.set(nftId, []);
    }

    const history = this.transactionHistories.get(nftId)!;
    history.push({
      hash: blockHash,
      timestamp: block.timestamp,
      action: "add_record",
      details: `Medical record added: ${recordData.type || recordData.diagnosis || "Unknown"}`,
    });

    return nftId;
  }

  getPatientRecords(patientId: string): Block[] {
    return this.blocks.filter((block) => block.patientId === patientId);
  }

  verifyNFT(nftId: string): {
    isValid: boolean;
    blockHash: string;
    mintedAt: number;
    transactionCount: number;
  } {
    const block = this.blocks.find((b) => b.nftId === nftId);
    const history = this.transactionHistories.get(nftId) || [];

    return {
      isValid: !!block,
      blockHash: block?.blockHash || "INVALID",
      mintedAt: block?.timestamp || 0,
      transactionCount: history.length,
    };
  }

  getTransactionHistory(nftId: string): TransactionHistory[] {
    return this.transactionHistories.get(nftId) || [];
  }

  getBlockByNftId(nftId: string): Block | undefined {
    return this.blocks.find((b) => b.nftId === nftId);
  }
}

export const blockchain = new MockBlockchain();
