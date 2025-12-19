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

interface NFTMetadata {
  nftId: string;
  tokenId: string;
  owner: string;
  hospital: string;
  recordType: string;
  diagnosis: string;
  mintedAt: number;
  blockHash: string;
  gasUsed: string;
  verified: boolean;
  value: number;
}

export class MockBlockchain {
  private blocks: Block[] = [];
  private transactionHistories: Map<string, TransactionHistory[]> = new Map();
  private nftMetadata: Map<string, NFTMetadata> = new Map();
  private patientWallets: Map<string, string[]> = new Map();
  private nftIdCounter = 10000;
  private tokenCounter = 1001;

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

  mintNFT(patientId: string, recordData: any, hospital: string): NFTMetadata {
    const tokenId = `MH#${new Date().getFullYear()}-${String(this.tokenCounter++).padStart(3, '0')}`;
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

    const metadata: NFTMetadata = {
      nftId,
      tokenId,
      owner: patientId,
      hospital,
      recordType: recordData.type || recordData.diagnosis || "Medical Record",
      diagnosis: recordData.diagnosis || recordData.type || "Unknown",
      mintedAt: Date.now(),
      blockHash,
      gasUsed: "0.0034 ETH",
      verified: true,
      value: Math.floor(Math.random() * 50) + 10,
    };

    this.nftMetadata.set(nftId, metadata);

    if (!this.patientWallets.has(patientId)) {
      this.patientWallets.set(patientId, []);
    }
    this.patientWallets.get(patientId)!.push(nftId);

    if (!this.transactionHistories.has(nftId)) {
      this.transactionHistories.set(nftId, []);
    }

    const history = this.transactionHistories.get(nftId)!;
    history.push({
      hash: blockHash,
      timestamp: block.timestamp,
      action: "mint",
      details: `NFT Minted: ${metadata.recordType} by ${hospital}`,
    });

    return metadata;
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

  getNFTWallet(patientId: string): NFTMetadata[] {
    const nftIds = this.patientWallets.get(patientId) || [];
    return nftIds.map(id => this.nftMetadata.get(id)!).filter(Boolean);
  }

  getNFTDetails(nftId: string): NFTMetadata | undefined {
    return this.nftMetadata.get(nftId);
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
