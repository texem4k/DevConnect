import {Injectable, inject, OnInit} from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
  private authService = inject(AuthService);
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    return this.ensureInit();
  }

  private ensureInit(): Promise<void> {
    return (this.initPromise ??= this.doInit());
  }

  private async doInit(): Promise<void> {
    const isConsistent = (await this.sqlite.checkConnectionsConsistency()).result;
    const isConn = (await this.sqlite.isConnection('suscripcion_db', false)).result;

    this.db = (isConsistent && isConn)
      ? await this.sqlite.retrieveConnection('suscripcion_db', false)
      : await this.sqlite.createConnection('suscripcion_db', false, 'no-encryption', 1, false);

    await this.db.open();

    const verResult = await this.db.query('PRAGMA user_version');
    const version = verResult.values?.[0]?.user_version ?? 0;

    if (version < 2) {
      await this.db.execute(`
        DROP TABLE IF EXISTS subscriptions;
        CREATE TABLE subscriptions (
         userId    TEXT NOT NULL,
         projectId TEXT NOT NULL,
         PRIMARY KEY (userId, projectId)
        );
        PRAGMA user_version = 2;
      `);
    }
  }

  async getSubscribedProjectIds(): Promise<string[]> {
    await this.ensureInit();
    const uid = this.authService.currentUser?.uid;
    if (!uid) return [];

    const result = await this.db.query(
      'SELECT projectId FROM subscriptions WHERE userId = ?',
      [uid]
    );
    return result.values?.map(r => r.projectId) ?? [];
  }

  async isSubscribed(projectId: string): Promise<boolean> {
    await this.ensureInit();
    const uid = this.authService.currentUser?.uid;
    if (!uid) return false;

    const result = await this.db.query(
      'SELECT projectId FROM subscriptions WHERE userId = ? AND projectId = ?',
      [uid, projectId]
    );
    return (result.values?.length ?? 0) > 0;
  }

  async subscribe(projectId: string): Promise<void> {
    await this.ensureInit();
    const uid = this.authService.currentUser?.uid;
    if (!uid) return;

    await this.db.run(
      'INSERT OR IGNORE INTO subscriptions (userId, projectId) VALUES (?, ?)',
      [uid, projectId]
    );
  }

  async unSubscribe(projectId: string): Promise<void> {
    await this.ensureInit();
    const uid = this.authService.currentUser?.uid;
    if (!uid) return;

    await this.db.run(
      'DELETE FROM subscriptions WHERE userId = ? AND projectId = ?',
      [uid, projectId]
    );
  }
}
